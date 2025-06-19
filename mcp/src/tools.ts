import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CrawlabClient } from "./client.js";

import { configureSpiderTools } from "./tools/spiders.js";
import { configureTaskTools } from "./tools/tasks.js";
import { configureNodeTools } from "./tools/nodes.js";
import { configureScheduleTools } from "./tools/schedules.js";
import { configureSystemTools } from "./tools/system.js";

export function configureAllTools(server: McpServer, client: CrawlabClient) {
  configureSpiderTools(server, client);
  configureTaskTools(server, client);
  configureNodeTools(server, client);
  configureScheduleTools(server, client);
  configureSystemTools(server, client);
}
