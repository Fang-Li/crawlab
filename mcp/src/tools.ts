import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CrawlabClient } from "./client.js";

import { configureSpiderTools } from '@tools/spiders';
import { configureTaskTools } from '@tools/tasks';
import { configureNodeTools } from '@tools/nodes';
import { configureScheduleTools } from '@tools/schedules';
import { configureSystemTools } from '@tools/system';
import { configureProjectTools } from '@tools/projects';
import { configureDatabaseTools } from '@tools/databases';
import { configureGitTools } from '@tools/git';
import { configureStatsTools } from '@tools/stats';
import { configureAITools } from '@tools/ai';

export function configureAllTools(server: McpServer, client: CrawlabClient) {
  configureSpiderTools(server, client);
  configureTaskTools(server, client);
  configureNodeTools(server, client);
  configureScheduleTools(server, client);
  configureSystemTools(server, client);
  configureProjectTools(server, client);
  configureDatabaseTools(server, client);
  configureGitTools(server, client);
  configureStatsTools(server, client);
  configureAITools(server, client);
}
