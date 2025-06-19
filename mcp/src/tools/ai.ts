import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CrawlabClient } from "../client.js";
import { z } from "zod";

const AI_TOOLS = {
  // LLM Provider Management
  list_llm_providers: "crawlab_list_llm_providers",
  get_llm_provider: "crawlab_get_llm_provider",
  create_llm_provider: "crawlab_create_llm_provider",
  update_llm_provider: "crawlab_update_llm_provider",
  delete_llm_provider: "crawlab_delete_llm_provider",
  
  // Chat Conversations
  list_conversations: "crawlab_list_conversations",
  get_conversation: "crawlab_get_conversation",
  create_conversation: "crawlab_create_conversation",
  update_conversation: "crawlab_update_conversation",
  delete_conversation: "crawlab_delete_conversation",
  get_conversation_messages: "crawlab_get_conversation_messages",
  get_chat_message: "crawlab_get_chat_message",
  
  // AutoProbe (AI Web Scraping)
  list_autoprobes: "crawlab_list_autoprobes",
  get_autoprobe: "crawlab_get_autoprobe",
  create_autoprobe: "crawlab_create_autoprobe",
  update_autoprobe: "crawlab_update_autoprobe",
  delete_autoprobe: "crawlab_delete_autoprobe",
  run_autoprobe_task: "crawlab_run_autoprobe_task",
  get_autoprobe_tasks: "crawlab_get_autoprobe_tasks",
  get_autoprobe_preview: "crawlab_get_autoprobe_preview",
  get_autoprobe_pattern: "crawlab_get_autoprobe_pattern",
  
  // AutoProbe V2
  list_autoprobes_v2: "crawlab_list_autoprobes_v2",
  get_autoprobe_v2: "crawlab_get_autoprobe_v2",
  create_autoprobe_v2: "crawlab_create_autoprobe_v2",
  update_autoprobe_v2: "crawlab_update_autoprobe_v2",
  delete_autoprobe_v2: "crawlab_delete_autoprobe_v2",
  run_autoprobe_v2_task: "crawlab_run_autoprobe_v2_task",
  get_autoprobe_v2_tasks: "crawlab_get_autoprobe_v2_tasks",
  get_autoprobe_v2_preview: "crawlab_get_autoprobe_v2_preview",
  get_autoprobe_v2_pattern: "crawlab_get_autoprobe_v2_pattern",
  get_autoprobe_v2_pattern_results: "crawlab_get_autoprobe_v2_pattern_results",
};

export function configureAITools(server: McpServer, client: CrawlabClient) {
  // LLM Provider Management
  server.tool(
    AI_TOOLS.list_llm_providers,
    "List all LLM providers configured in Crawlab",
    {
      page: z.number().optional().describe("Page number for pagination (default: 1)"),
      page_size: z.number().optional().describe("Number of providers per page (default: 10)"),
      filter: z.string().optional().describe("Filter providers by name or type"),
    },
    async (args) => {
      try {
        const result = await client.getLLMProviders(args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing LLM providers: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    AI_TOOLS.get_llm_provider,
    "Get details of a specific LLM provider",
    {
      id: z.string().describe("ID of the LLM provider"),
    },
    async ({ id }) => {
      try {
        const result = await client.getLLMProvider(id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting LLM provider: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    AI_TOOLS.create_llm_provider,
    "Create a new LLM provider configuration",
    {
      name: z.string().describe("Display name for the provider"),
      type: z.string().describe("Provider type (e.g., 'openai', 'azure-openai', 'anthropic', 'gemini')"),
      api_key: z.string().describe("API key for the provider"),
      api_base_url: z.string().optional().describe("Custom API base URL"),
      api_version: z.string().optional().describe("API version"),
      default_model: z.string().optional().describe("Default model for this provider"),
      models: z.array(z.string()).optional().describe("List of supported models"),
      deployment_name: z.string().optional().describe("Deployment name (for Azure)"),
    },
    async (args) => {
      try {
        const result = await client.createLLMProvider(args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating LLM provider: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    AI_TOOLS.update_llm_provider,
    "Update an existing LLM provider configuration",
    {
      id: z.string().describe("ID of the LLM provider to update"),
      name: z.string().optional().describe("Display name for the provider"),
      type: z.string().optional().describe("Provider type"),
      api_key: z.string().optional().describe("API key for the provider"),
      api_base_url: z.string().optional().describe("Custom API base URL"),
      api_version: z.string().optional().describe("API version"),
      default_model: z.string().optional().describe("Default model for this provider"),
      models: z.array(z.string()).optional().describe("List of supported models"),
      deployment_name: z.string().optional().describe("Deployment name (for Azure)"),
    },
    async ({ id, ...updateData }) => {
      try {
        const result = await client.updateLLMProvider(id, updateData);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error updating LLM provider: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    AI_TOOLS.delete_llm_provider,
    "Delete an LLM provider configuration",
    {
      id: z.string().describe("ID of the LLM provider to delete"),
    },
    async ({ id }) => {
      try {
        await client.deleteLLMProvider(id);
        return {
          content: [
            {
              type: "text",
              text: `LLM provider ${id} deleted successfully`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error deleting LLM provider: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Chat Conversations
  server.tool(
    AI_TOOLS.list_conversations,
    "List all AI chat conversations",
    {
      page: z.number().optional().describe("Page number for pagination"),
      page_size: z.number().optional().describe("Number of conversations per page"),
      filter: z.string().optional().describe("Filter conversations by title or content"),
    },
    async (args) => {
      try {
        const result = await client.getConversations(args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing conversations: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    AI_TOOLS.get_conversation,
    "Get details of a specific conversation",
    {
      id: z.string().describe("ID of the conversation"),
    },
    async ({ id }) => {
      try {
        const result = await client.getConversation(id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting conversation: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    AI_TOOLS.get_conversation_messages,
    "Get all messages from a conversation",
    {
      id: z.string().describe("ID of the conversation"),
    },
    async ({ id }) => {
      try {
        const result = await client.getConversationMessages(id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting conversation messages: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // AutoProbe V2 (Latest)
  server.tool(
    AI_TOOLS.list_autoprobes_v2,
    "List all AutoProbe V2 configurations (AI-powered web scraping)",
    {
      page: z.number().optional().describe("Page number for pagination"),
      page_size: z.number().optional().describe("Number of AutoProbes per page"),
      filter: z.string().optional().describe("Filter AutoProbes by name or URL"),
    },
    async (args) => {
      try {
        const result = await client.getAutoProbesV2(args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing AutoProbes V2: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    AI_TOOLS.get_autoprobe_v2,
    "Get details of a specific AutoProbe V2 configuration",
    {
      id: z.string().describe("ID of the AutoProbe"),
    },
    async ({ id }) => {
      try {
        const result = await client.getAutoProbeV2(id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting AutoProbe V2: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    AI_TOOLS.create_autoprobe_v2,
    "Create a new AutoProbe V2 configuration for AI-powered web scraping",
    {
      name: z.string().describe("Name of the AutoProbe"),
      url: z.string().describe("Target URL to scrape"),
      description: z.string().optional().describe("Description of what to extract"),
      query: z.string().optional().describe("Natural language query describing the data to extract"),
      settings: z.object({}).optional().describe("Additional configuration settings"),
    },
    async (args) => {
      try {
        const result = await client.createAutoProbeV2(args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating AutoProbe V2: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    AI_TOOLS.run_autoprobe_v2_task,
    "Run an AutoProbe V2 scraping task",
    {
      id: z.string().describe("ID of the AutoProbe"),
      query: z.string().optional().describe("Custom query for this run"),
      view_port: z.object({}).optional().describe("Custom viewport settings"),
    },
    async ({ id, ...params }) => {
      try {
        const result = await client.runAutoProbeV2Task(id, params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error running AutoProbe V2 task: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    AI_TOOLS.get_autoprobe_v2_preview,
    "Get a preview of what an AutoProbe V2 would extract",
    {
      id: z.string().describe("ID of the AutoProbe"),
    },
    async ({ id }) => {
      try {
        const result = await client.getAutoProbeV2Preview(id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting AutoProbe V2 preview: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    AI_TOOLS.get_autoprobe_v2_pattern,
    "Get the extraction pattern for an AutoProbe V2",
    {
      id: z.string().describe("ID of the AutoProbe"),
    },
    async ({ id }) => {
      try {
        const result = await client.getAutoProbeV2Pattern(id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting AutoProbe V2 pattern: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // AutoProbe V1 (Legacy Support)
  server.tool(
    AI_TOOLS.list_autoprobes,
    "List all AutoProbe V1 configurations (legacy)",
    {
      page: z.number().optional().describe("Page number for pagination"),
      page_size: z.number().optional().describe("Number of AutoProbes per page"),
      filter: z.string().optional().describe("Filter AutoProbes by name or URL"),
    },
    async (args) => {
      try {
        const result = await client.getAutoProbes(args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing AutoProbes V1: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    AI_TOOLS.get_autoprobe,
    "Get details of a specific AutoProbe V1 configuration",
    {
      id: z.string().describe("ID of the AutoProbe"),
    },
    async ({ id }) => {
      try {
        const result = await client.getAutoProbe(id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting AutoProbe V1: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    AI_TOOLS.create_autoprobe,
    "Create a new AutoProbe V1 configuration (legacy)",
    {
      name: z.string().describe("Name of the AutoProbe"),
      url: z.string().describe("Target URL to scrape"),
      description: z.string().optional().describe("Description of what to extract"),
      query: z.string().optional().describe("Natural language query describing the data to extract"),
    },
    async (args) => {
      try {
        const result = await client.createAutoProbe(args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating AutoProbe V1: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
