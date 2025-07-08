package client

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/cenkalti/backoff/v4"
	"github.com/crawlab-team/crawlab/core/grpc/middlewares"
	"github.com/crawlab-team/crawlab/core/interfaces"
	"github.com/crawlab-team/crawlab/core/utils"
	grpc2 "github.com/crawlab-team/crawlab/grpc"
	"google.golang.org/grpc"
	"google.golang.org/grpc/connectivity"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/keepalive"
)

type GrpcClient struct {
	// dependencies
	nodeCfgSvc interfaces.NodeConfigService

	// settings
	address string
	timeout time.Duration

	// internals
	conn    *grpc.ClientConn
	err     error
	once    sync.Once
	stopped bool
	stop    chan struct{}
	interfaces.Logger

	// clients
	NodeClient             grpc2.NodeServiceClient
	TaskClient             grpc2.TaskServiceClient
	ModelBaseServiceClient grpc2.ModelBaseServiceClient
	DependencyClient       grpc2.DependencyServiceClient
	MetricClient           grpc2.MetricServiceClient

	// Add new fields for state management
	state          connectivity.State
	stateMux       sync.RWMutex
	reconnect      chan struct{}
	
	// Circuit breaker fields
	failureCount   int
	lastFailure    time.Time
	circuitBreaker bool
	cbMux          sync.RWMutex
}

func (c *GrpcClient) Start() {
	c.once.Do(func() {
		// initialize reconnect channel
		c.reconnect = make(chan struct{})

		// start state monitor
		go c.monitorState()

		// connect (this will also register services)
		err := c.connect()
		if err != nil {
			c.Fatalf("failed to connect: %v", err)
			return
		}
	})
}

func (c *GrpcClient) Stop() (err error) {
	// set stopped flag
	c.stopped = true
	c.stop <- struct{}{}
	c.Infof("stopped")

	// skip if connection is nil
	if c.conn == nil {
		return nil
	}

	// close connection
	if err := c.conn.Close(); err != nil {
		c.Errorf("failed to close connection: %v", err)
		return err
	}
	c.Infof("disconnected from %s", c.address)

	return nil
}

func (c *GrpcClient) WaitForReady() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			if c.IsReady() {
				c.Debugf("client is now ready")
				return
			}
		case <-c.stop:
			c.Errorf("client has stopped")
		}
	}
}

func (c *GrpcClient) register() {
	c.NodeClient = grpc2.NewNodeServiceClient(c.conn)
	c.ModelBaseServiceClient = grpc2.NewModelBaseServiceClient(c.conn)
	c.TaskClient = grpc2.NewTaskServiceClient(c.conn)
	c.DependencyClient = grpc2.NewDependencyServiceClient(c.conn)
	c.MetricClient = grpc2.NewMetricServiceClient(c.conn)
}

func (c *GrpcClient) Context() (ctx context.Context, cancel context.CancelFunc) {
	return context.WithTimeout(context.Background(), c.timeout)
}

func (c *GrpcClient) IsReady() (res bool) {
	state := c.conn.GetState()
	return c.conn != nil && state == connectivity.Ready
}

func (c *GrpcClient) IsClosed() (res bool) {
	if c.conn != nil {
		return c.conn.GetState() == connectivity.Shutdown
	}
	return false
}

func (c *GrpcClient) monitorState() {
	idleStartTime := time.Time{}
	idleGracePeriod := 30 * time.Second // Allow IDLE state for 30 seconds before considering it a problem
	
	for {
		select {
		case <-c.stop:
			return
		default:
			if c.conn == nil {
				time.Sleep(time.Second)
				continue
			}

			previous := c.getState()
			current := c.conn.GetState()

			if previous != current {
				c.setState(current)
				c.Infof("state changed from %s to %s", previous, current)

				// Handle state transitions more intelligently
				switch current {
				case connectivity.TransientFailure, connectivity.Shutdown:
					// Always reconnect on actual failures, but respect circuit breaker
					if !c.isCircuitBreakerOpen() {
						select {
						case c.reconnect <- struct{}{}:
							c.Infof("triggering reconnection due to state change to %s", current)
						default:
						}
					} else {
						c.Debugf("circuit breaker open, not triggering reconnection for state %s", current)
					}
				case connectivity.Idle:
					if previous == connectivity.Ready {
						// Start grace period timer for IDLE state
						idleStartTime = time.Now()
						c.Debugf("connection went IDLE, starting grace period")
					}
				case connectivity.Ready:
					// Reset idle timer when connection becomes ready
					idleStartTime = time.Time{}
					// Record successful connection
					c.recordSuccess()
				}
			}

			// Check if IDLE state has exceeded grace period
			if current == connectivity.Idle && !idleStartTime.IsZero() && 
			   time.Since(idleStartTime) > idleGracePeriod && !c.isCircuitBreakerOpen() {
				c.Warnf("connection has been IDLE for %v, triggering reconnection", time.Since(idleStartTime))
				select {
				case c.reconnect <- struct{}{}:
					c.Infof("triggering reconnection due to prolonged IDLE state")
				default:
				}
				idleStartTime = time.Time{} // Reset timer to avoid repeated reconnections
			}

			time.Sleep(time.Second)
		}
	}
}

func (c *GrpcClient) setState(state connectivity.State) {
	c.stateMux.Lock()
	defer c.stateMux.Unlock()
	c.state = state
}

func (c *GrpcClient) getState() connectivity.State {
	c.stateMux.RLock()
	defer c.stateMux.RUnlock()
	return c.state
}

func (c *GrpcClient) connect() (err error) {
	// Start reconnection loop with proper cleanup
	go func() {
		defer func() {
			if r := recover(); r != nil {
				c.Errorf("reconnection loop panic: %v", r)
			}
		}()
		
		for {
			select {
			case <-c.stop:
				c.Debugf("reconnection loop stopping")
				return
			case <-c.reconnect:
				if !c.stopped && !c.isCircuitBreakerOpen() {
					c.Infof("attempting to reconnect to %s", c.address)
					if err := c.doConnect(); err != nil {
						c.Errorf("reconnection failed: %v", err)
						c.recordFailure()
						// Add a brief delay before allowing next reconnection attempt
						time.Sleep(2 * time.Second)
					} else {
						c.recordSuccess()
					}
				} else if c.isCircuitBreakerOpen() {
					c.Debugf("circuit breaker is open, skipping reconnection attempt")
				}
			}
		}
	}()

	return c.doConnect()
}

// Circuit breaker methods
func (c *GrpcClient) isCircuitBreakerOpen() bool {
	c.cbMux.RLock()
	defer c.cbMux.RUnlock()
	
	// Circuit breaker opens after 5 consecutive failures
	if c.failureCount >= 5 {
		// Auto-recover after 1 minute
		if time.Since(c.lastFailure) > 1*time.Minute {
			return false
		}
		return true
	}
	return false
}

func (c *GrpcClient) recordFailure() {
	c.cbMux.Lock()
	defer c.cbMux.Unlock()
	c.failureCount++
	c.lastFailure = time.Now()
	if c.failureCount >= 5 {
		c.Warnf("circuit breaker opened after %d consecutive failures", c.failureCount)
	}
}

func (c *GrpcClient) recordSuccess() {
	c.cbMux.Lock()
	defer c.cbMux.Unlock()
	if c.failureCount > 0 {
		c.Infof("connection restored, resetting circuit breaker (was %d failures)", c.failureCount)
	}
	c.failureCount = 0
	c.lastFailure = time.Time{}
}

func (c *GrpcClient) doConnect() (err error) {
	op := func() error {
		// Close existing connection if any
		if c.conn != nil {
			if err := c.conn.Close(); err != nil {
				c.Debugf("failed to close existing connection: %v", err)
			}
		}

		// connection options with better settings for stability
		opts := []grpc.DialOption{
			grpc.WithTransportCredentials(insecure.NewCredentials()),
			grpc.WithChainUnaryInterceptor(middlewares.GetGrpcClientAuthTokenUnaryChainInterceptor()),
			grpc.WithChainStreamInterceptor(middlewares.GetGrpcClientAuthTokenStreamChainInterceptor()),
			// Add keep-alive settings to maintain connection health
			grpc.WithKeepaliveParams(keepalive.ClientParameters{
				Time:                30 * time.Second, // Send ping every 30 seconds
				Timeout:             5 * time.Second,  // Wait 5 seconds for ping response
				PermitWithoutStream: true,             // Send pings even without active streams
			}),
		}

		// create new client connection
		c.conn, err = grpc.NewClient(c.address, opts...)
		if err != nil {
			c.Errorf("failed to create connection to %s: %v", c.address, err)
			return err
		}

		// connect
		c.Infof("connecting to %s", c.address)
		c.conn.Connect()

		// wait for connection to be ready with shorter timeout for faster failure detection
		ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()
		
		// Wait for state to change from connecting
		for c.conn.GetState() == connectivity.Connecting {
			if !c.conn.WaitForStateChange(ctx, connectivity.Connecting) {
				return fmt.Errorf("failed to connect to %s: connection timeout", c.address)
			}
		}

		// Check final state
		state := c.conn.GetState()
		if state != connectivity.Ready {
			return fmt.Errorf("failed to connect to %s: final state is %s", c.address, state)
		}

		// success
		c.Infof("connected to %s", c.address)
		
		// Register services after successful connection
		c.register()

		return nil
	}
	
	// Configure backoff with more reasonable settings
	b := backoff.NewExponentialBackOff()
	b.InitialInterval = 1 * time.Second  // Start with shorter interval
	b.MaxInterval = 30 * time.Second     // Cap the max interval
	b.MaxElapsedTime = 5 * time.Minute   // Reduce max retry time
	b.Multiplier = 1.5                   // Gentler exponential growth
	
	n := func(err error, duration time.Duration) {
		c.Errorf("failed to connect to %s: %v, retrying in %s", c.address, err, duration)
	}
	
	err = backoff.RetryNotify(op, b, n)
	if err != nil {
		c.recordFailure()
		return err
	}
	
	c.recordSuccess()
	return nil
}

func newGrpcClient() (c *GrpcClient) {
	return &GrpcClient{
		address: utils.GetGrpcAddress(),
		timeout: 10 * time.Second,
		stop:    make(chan struct{}),
		Logger:  utils.NewLogger("GrpcClient"),
		state:   connectivity.Idle,
	}
}

var _client *GrpcClient
var _clientOnce sync.Once

func GetGrpcClient() *GrpcClient {
	_clientOnce.Do(func() {
		_client = newGrpcClient()
		go _client.Start()
	})
	return _client
}
