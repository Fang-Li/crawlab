import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CrawlabClient } from "../client.js";

const SYSTEM_TOOLS = {
  health_check: "crawlab_health_check",
  system_status: "crawlab_system_status",
};

export function configureSystemTools(server: McpServer, client: CrawlabClient) {
  server.tool(
    SYSTEM_TOOLS.health_check,
    "Check if Crawlab system is healthy and reachable",
    {},
    async () => {
      try {
        const isHealthy = await client.healthCheck();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                healthy: isHealthy,
                status: isHealthy ? "System is healthy and reachable" : "System is not reachable",
                timestamp: new Date().toISOString(),
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error checking system health: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    SYSTEM_TOOLS.system_status,
    "Get comprehensive system status including nodes, recent tasks, and schedules",
    {},
    async () => {
      try {
        // Get system overview data
        const [nodesResponse, tasksResponse, schedulesResponse] = await Promise.all([
          client.getNodes({ page: 1, size: 50 }),
          client.getTasks({ page: 1, size: 20 }),
          client.getSchedules({ page: 1, size: 50 }),
        ]);

        const summary = {
          timestamp: new Date().toISOString(),
          nodes: {
            total: nodesResponse.total || 0,
            online: nodesResponse.data?.filter(node => node.status === 'online').length || 0,
            offline: nodesResponse.data?.filter(node => node.status === 'offline').length || 0,
          },
          tasks: {
            total_recent: tasksResponse.total || 0,
            running: tasksResponse.data?.filter(task => task.status === 'running').length || 0,
            pending: tasksResponse.data?.filter(task => task.status === 'pending').length || 0,
            completed: tasksResponse.data?.filter(task => task.status === 'success').length || 0,
            failed: tasksResponse.data?.filter(task => task.status === 'error').length || 0,
          },
          schedules: {
            total: schedulesResponse.total || 0,
            enabled: schedulesResponse.data?.filter(schedule => schedule.enabled).length || 0,
            disabled: schedulesResponse.data?.filter(schedule => !schedule.enabled).length || 0,
          },
          health: await client.healthCheck(),
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting system status: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}

export { SYSTEM_TOOLS };
