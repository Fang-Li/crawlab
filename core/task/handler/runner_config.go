package handler

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"syscall"

	"github.com/crawlab-team/crawlab/core/entity"
	"github.com/crawlab-team/crawlab/core/models/client"
	"github.com/crawlab-team/crawlab/core/models/models"
	"github.com/crawlab-team/crawlab/core/utils"
)

// configurePythonPath sets up the Python environment paths, handling both pyenv and default installations
func (r *Runner) configurePythonPath() {
	// Configure global node_modules path
	pyenvRoot := utils.GetPyenvPath()
	pyenvShimsPath := pyenvRoot + "/shims"
	pyenvBinPath := pyenvRoot + "/bin"

	// Configure global pyenv path
	_ = os.Setenv("PYENV_ROOT", pyenvRoot)
	_ = os.Setenv("PATH", pyenvShimsPath+":"+os.Getenv("PATH"))
	_ = os.Setenv("PATH", pyenvBinPath+":"+os.Getenv("PATH"))
}

// configureNodePath sets up the Node.js environment paths, handling both nvm and default installations
func (r *Runner) configureNodePath() {
	// Configure nvm-based Node.js paths
	envPath := os.Getenv("PATH")

	// Configure global node_modules path
	nodePath := utils.GetNodeModulesPath()
	if !strings.Contains(envPath, nodePath) {
		_ = os.Setenv("PATH", nodePath+":"+envPath)
	}
	_ = os.Setenv("NODE_PATH", nodePath)

	// Configure global node_bin path
	nodeBinPath := utils.GetNodeBinPath()
	if !strings.Contains(envPath, nodeBinPath) {
		_ = os.Setenv("PATH", nodeBinPath+":"+os.Getenv("PATH"))
	}
}

func (r *Runner) configureGoPath() {
	// Configure global go path
	goPath := utils.GetGoPath()
	if goPath != "" {
		_ = os.Setenv("GOPATH", goPath)
	}
}

// configureEnv sets up the environment variables for the task process, including:
// - Node.js paths
// - Crawlab-specific variables
// - Global environment variables from the system
func (r *Runner) configureEnv() {
	// Configure Python path
	r.configurePythonPath()

	// Configure Node.js path
	r.configureNodePath()

	// Configure Go path
	r.configureGoPath()

	// Default envs
	r.cmd.Env = os.Environ()

	// Remove CRAWLAB_ prefixed environment variables
	for i := 0; i < len(r.cmd.Env); i++ {
		env := r.cmd.Env[i]
		if strings.HasPrefix(env, "CRAWLAB_") {
			r.cmd.Env = append(r.cmd.Env[:i], r.cmd.Env[i+1:]...)
			i--
		}
	}

	// Task-specific environment variables
	r.cmd.Env = append(r.cmd.Env, "CRAWLAB_TASK_ID="+r.tid.Hex())

	// Global environment variables
	envs, err := client.NewModelService[models.Environment]().GetMany(nil, nil)
	if err != nil {
		r.Errorf("failed to get environments: %v", err)
	}
	for _, env := range envs {
		r.cmd.Env = append(r.cmd.Env, env.Key+"="+env.Value)
	}

	// Add environment variable for child processes to identify they're running under Crawlab
	r.cmd.Env = append(r.cmd.Env, "CRAWLAB_PARENT_PID="+fmt.Sprint(os.Getpid()))
}

// configureCwd sets the working directory for the task based on the spider's configuration
func (r *Runner) configureCwd() {
	workspacePath := utils.GetWorkspace()
	if r.s.GitId.IsZero() {
		// not git
		r.cwd = filepath.Join(workspacePath, r.s.Id.Hex())
	} else {
		// git
		r.cwd = filepath.Join(workspacePath, r.s.GitId.Hex(), r.s.GitRootPath)
	}
}

// configureCmd builds and configures the command to be executed, including setting up IPC pipes
// and processing command parameters
func (r *Runner) configureCmd() (err error) {
	var cmdStr string

	// command
	if r.t.Cmd == "" {
		cmdStr = r.s.Cmd
	} else {
		cmdStr = r.t.Cmd
	}

	// parameters
	if r.t.Param != "" {
		cmdStr += " " + r.t.Param
	} else if r.s.Param != "" {
		cmdStr += " " + r.s.Param
	}

	// get cmd instance
	r.cmd, err = utils.BuildCmd(cmdStr)
	if err != nil {
		r.Errorf("error building command: %v", err)
		return err
	}

	// set working directory
	r.cmd.Dir = r.cwd

	// ZOMBIE PREVENTION: Set process group to enable proper cleanup of child processes
	if runtime.GOOS != "windows" {
		// Create new process group on Unix systems to ensure child processes can be killed together
		r.cmd.SysProcAttr = &syscall.SysProcAttr{
			Setpgid: true, // Create new process group
			Pgid:    0,    // Use process ID as process group ID
		}
	}

	// Configure pipes for IPC and logs
	r.stdinPipe, err = r.cmd.StdinPipe()
	if err != nil {
		r.Errorf("error creating stdin pipe: %v", err)
		return err
	}

	// Add stdout pipe for IPC and logs
	r.stdoutPipe, err = r.cmd.StdoutPipe()
	if err != nil {
		r.Errorf("error creating stdout pipe: %v", err)
		return err
	}

	// Add stderr pipe for error logs
	stderrPipe, err := r.cmd.StderrPipe()
	if err != nil {
		r.Errorf("error creating stderr pipe: %v", err)
		return err
	}

	// Create buffered readers
	r.readerStdout = bufio.NewReader(r.stdoutPipe)
	r.readerStderr = bufio.NewReader(stderrPipe)

	// Initialize IPC channel
	r.ipcChan = make(chan entity.IPCMessage)

	return nil
}
