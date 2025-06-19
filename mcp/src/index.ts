#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { configurePrompts } from './prompts';
import { configureAllTools } from './tools';
import { CrawlabClient } from './client';
import { packageVersion } from './version';

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: mcp-server-crawlab <crawlab_url> [api_token]');
  console.error('Example: mcp-server-crawlab http://localhost:8080');
  console.error(
    'Example: mcp-server-crawlab http://localhost:8080 your-api-token'
  );
  process.exit(1);
}

const crawlabUrl = args[0];
const apiToken = args[1] || process.env.CRAWLAB_API_TOKEN;

async function main() {
  const server = new McpServer({
    name: 'Crawlab MCP Server',
    version: packageVersion,
  });

  // Initialize Crawlab client
  const client = new CrawlabClient(crawlabUrl, apiToken);

  // Configure prompts and tools
  configurePrompts(server);
  configureAllTools(server, client);

  const transport = new StdioServerTransport();
  console.error(`Crawlab MCP Server version: ${packageVersion}`);
  console.error(`Connecting to Crawlab at: ${crawlabUrl}`);

  await server.connect(transport);
}

main().catch(error => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
