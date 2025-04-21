export declare global {
  type LLMProviderKey =
    | 'openai'
    | 'azure-openai'
    | 'anthropic'
    | 'gemini'
    | 'grok'
    | 'qwen'
    | 'deepseek'
    | 'mistral'
    | 'openai-compatible';

  interface LLMProvider extends BaseModel {
    key?: LLMProviderKey;
    name?: string;
    enabled?: boolean;
    api_key?: string;
    api_base_url?: string;
    api_version?: string;
    models?: string[];
  }

  interface LLMProviderItem {
    key: LLMProviderKey;
    name: string;
    icon?: Icon;
    defaultModels?: string[];
    defaultApiVersions?: string[];
  }

  type ChatMessageRole = 'system' | 'user' | 'assistant';

  type ChatMessageStatus = 'pending' | 'completed' | 'failed';

  interface ChatMessage extends BaseModel {
    conversation_id: string;
    role: ChatMessageRole;
    content?: string;
    content_ids?: string[];
    contents?: ChatMessageContent[];
    tokens?: number;
    model?: string;
    metadata?: Record<string, any>;
    status: ChatMessageStatus;
    error?: string;
    usage?: ChatMessageUsage;

    // Frontend UI-specific properties
    timestamp?: Date;
    isStreaming?: boolean;
  }

  type ChatMessageContentType = 'text' | 'action';
  type ChatMessageActionStatus = 'pending' | 'success' | 'failed';

  interface ChatMessageContent extends BaseModel {
    message_id?: string;
    key?: string;
    content?: string;
    type: ChatMessageContentType;
    action?: string;
    action_status?: ChatMessageActionStatus;
    hidden?: boolean;
    usage?: ChatMessageUsage;

    // Frontend UI-specific properties
    isStreaming?: boolean;
  }

  interface ChatMessageUsage {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  }

  type ChatConversationStatus = 'active' | 'archived' | 'deleted';

  interface ChatConversation extends BaseModel {
    title?: string;
    description?: string;
    user_id?: string;
    model?: string;
    status?: ChatConversationStatus;
    last_message_at?: string;
    settings?: Record<string, any>;
    tags?: string[];
    messages?: ChatMessage[];
    created_at?: string;
    updated_at?: string;
  }

  interface ChatRequest {
    provider: string;
    model: string;
    query: string;
    system_prompt?: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    other_params?: Record<string, any>;
    conversation_id?: string;
  }

  interface ChatbotConfig {
    provider?: LLMProviderKey;
    model?: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }

  interface ChatbotStreamMessage {
    conversation_id?: string;
    conversation_title?: string;
    message_id?: string;
    key?: string;
    content?: string;
    type: 'text' | 'action'; // Message type
    action_id?: string;
    action?: string;
    action_status?: ChatMessageActionStatus;
    is_done?: boolean;
    is_initial?: boolean;
    error?: string;
    hidden?: boolean;
    is_text_done?: boolean;
    usage?: ChatMessageUsage;
  }

  interface ResourceContent {
    uri?: string;
    text?: string;
  }

  interface ParsedResourceContent extends ResourceContent {
    text?: string | boolean | number | Record<string, any> | Array<any>;
  }
}
