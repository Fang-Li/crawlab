export interface LLMProvider {
    name: string;
    features: string[];
    default_models: string[];
}
export interface ChatRequest {
    provider: string;
    config?: Record<string, string>;
    model: string;
    prompt: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    other_params?: Record<string, any>;
}
export interface ChatResponse {
    text: string;
    model: string;
    usage?: Record<string, any>;
    error?: string;
}
export interface ChatResponseChunk {
    text: string;
    model?: string;
    is_done: boolean;
    error?: string;
    full_text?: string;
    usage?: Record<string, any>;
}
export declare const getLLMProviders: () => Promise<LLMProvider[]>;
export declare const checkProviderFeatureSupport: (provider: string, feature: string, config?: Record<string, string>) => Promise<boolean>;
export declare const sendChatRequest: (chatRequest: ChatRequest) => Promise<ChatResponse>;
export declare const sendStreamingChatRequest: (chatRequest: ChatRequest, onChunk: (chunk: ChatResponseChunk) => void, onError: (error: any) => void, onComplete: () => void) => Promise<void>;
