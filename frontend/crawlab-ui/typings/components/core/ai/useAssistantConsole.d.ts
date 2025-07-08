declare const useAssistantConsole: () => {
    messageListRef: import("vue").Ref<{
        scrollToBottom: () => Promise<void>;
    } | null, {
        scrollToBottom: () => Promise<void>;
    } | {
        scrollToBottom: () => Promise<void>;
    } | null>;
    chatInputRef: import("vue").Ref<import("vue").CreateComponentPublicInstanceWithMixins<Readonly<{
        isLoading?: boolean;
        providers?: LLMProvider[];
        selectedProviderModel?: LLMProviderModel;
    }> & Readonly<{
        onCancel?: (() => any) | undefined;
        onSend?: ((message: string) => any) | undefined;
        "onModel-change"?: ((value: LLMProviderModel) => any) | undefined;
        "onAdd-model"?: (() => any) | undefined;
    }>, {
        focus: () => void;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
        cancel: () => any;
        send: (message: string) => any;
        "model-change": (value: LLMProviderModel) => any;
        "add-model": () => any;
    }, import("vue").PublicProps, {}, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        isLoading?: boolean;
        providers?: LLMProvider[];
        selectedProviderModel?: LLMProviderModel;
    }> & Readonly<{
        onCancel?: (() => any) | undefined;
        onSend?: ((message: string) => any) | undefined;
        "onModel-change"?: ((value: LLMProviderModel) => any) | undefined;
        "onAdd-model"?: (() => any) | undefined;
    }>, {
        focus: () => void;
    }, {}, {}, {}, {}> | null, import("vue").CreateComponentPublicInstanceWithMixins<Readonly<{
        isLoading?: boolean;
        providers?: LLMProvider[];
        selectedProviderModel?: LLMProviderModel;
    }> & Readonly<{
        onCancel?: (() => any) | undefined;
        onSend?: ((message: string) => any) | undefined;
        "onModel-change"?: ((value: LLMProviderModel) => any) | undefined;
        "onAdd-model"?: (() => any) | undefined;
    }>, {
        focus: () => void;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
        cancel: () => any;
        send: (message: string) => any;
        "model-change": (value: LLMProviderModel) => any;
        "add-model": () => any;
    }, import("vue").PublicProps, {}, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        isLoading?: boolean;
        providers?: LLMProvider[];
        selectedProviderModel?: LLMProviderModel;
    }> & Readonly<{
        onCancel?: (() => any) | undefined;
        onSend?: ((message: string) => any) | undefined;
        "onModel-change"?: ((value: LLMProviderModel) => any) | undefined;
        "onAdd-model"?: (() => any) | undefined;
    }>, {
        focus: () => void;
    }, {}, {}, {}, {}> | null>;
    currentConversation: import("vue").Ref<{
        [x: string]: any;
        title?: string | undefined;
        description?: string | undefined;
        user_id?: string | undefined;
        model?: string | undefined;
        status?: ChatConversationStatus | undefined;
        last_message_at?: string | undefined;
        settings?: Record<string, any> | undefined;
        tags?: string[] | undefined;
        messages?: {
            [x: string]: any;
            conversation_id: string;
            role: ChatMessageRole;
            content?: string | undefined;
            content_ids?: string[] | undefined;
            contents?: {
                [x: string]: any;
                message_id?: string | undefined;
                key?: string | undefined;
                parameters?: Record<string, any> | undefined;
                content?: string | undefined;
                type: ChatMessageContentType;
                action?: string | undefined;
                action_target?: string | undefined;
                action_status?: ChatMessageActionStatus | undefined;
                hidden?: boolean | undefined;
                usage?: {
                    prompt_tokens?: number | undefined;
                    completion_tokens?: number | undefined;
                    total_tokens?: number | undefined;
                } | undefined;
                isStreaming?: boolean | undefined;
                _id?: string | undefined;
                created_at?: string | undefined;
                created_by?: string | undefined;
                updated_at?: string | undefined;
            }[] | undefined;
            tokens?: number | undefined;
            model?: string | undefined;
            metadata?: Record<string, any> | undefined;
            status: ChatMessageStatus;
            error?: string | undefined;
            usage?: {
                prompt_tokens?: number | undefined;
                completion_tokens?: number | undefined;
                total_tokens?: number | undefined;
            } | undefined;
            timestamp?: Date | undefined;
            isStreaming?: boolean | undefined;
            _id?: string | undefined;
            created_at?: string | undefined;
            created_by?: string | undefined;
            updated_at?: string | undefined;
        }[] | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
        _id?: string | undefined;
        created_by?: string | undefined;
    } | null, ChatConversation | {
        [x: string]: any;
        title?: string | undefined;
        description?: string | undefined;
        user_id?: string | undefined;
        model?: string | undefined;
        status?: ChatConversationStatus | undefined;
        last_message_at?: string | undefined;
        settings?: Record<string, any> | undefined;
        tags?: string[] | undefined;
        messages?: {
            [x: string]: any;
            conversation_id: string;
            role: ChatMessageRole;
            content?: string | undefined;
            content_ids?: string[] | undefined;
            contents?: {
                [x: string]: any;
                message_id?: string | undefined;
                key?: string | undefined;
                parameters?: Record<string, any> | undefined;
                content?: string | undefined;
                type: ChatMessageContentType;
                action?: string | undefined;
                action_target?: string | undefined;
                action_status?: ChatMessageActionStatus | undefined;
                hidden?: boolean | undefined;
                usage?: {
                    prompt_tokens?: number | undefined;
                    completion_tokens?: number | undefined;
                    total_tokens?: number | undefined;
                } | undefined;
                isStreaming?: boolean | undefined;
                _id?: string | undefined;
                created_at?: string | undefined;
                created_by?: string | undefined;
                updated_at?: string | undefined;
            }[] | undefined;
            tokens?: number | undefined;
            model?: string | undefined;
            metadata?: Record<string, any> | undefined;
            status: ChatMessageStatus;
            error?: string | undefined;
            usage?: {
                prompt_tokens?: number | undefined;
                completion_tokens?: number | undefined;
                total_tokens?: number | undefined;
            } | undefined;
            timestamp?: Date | undefined;
            isStreaming?: boolean | undefined;
            _id?: string | undefined;
            created_at?: string | undefined;
            created_by?: string | undefined;
            updated_at?: string | undefined;
        }[] | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
        _id?: string | undefined;
        created_by?: string | undefined;
    } | null>;
    currentConversationId: import("vue").Ref<string, string>;
    conversations: import("vue").Ref<{
        [x: string]: any;
        title?: string | undefined;
        description?: string | undefined;
        user_id?: string | undefined;
        model?: string | undefined;
        status?: ChatConversationStatus | undefined;
        last_message_at?: string | undefined;
        settings?: Record<string, any> | undefined;
        tags?: string[] | undefined;
        messages?: {
            [x: string]: any;
            conversation_id: string;
            role: ChatMessageRole;
            content?: string | undefined;
            content_ids?: string[] | undefined;
            contents?: {
                [x: string]: any;
                message_id?: string | undefined;
                key?: string | undefined;
                parameters?: Record<string, any> | undefined;
                content?: string | undefined;
                type: ChatMessageContentType;
                action?: string | undefined;
                action_target?: string | undefined;
                action_status?: ChatMessageActionStatus | undefined;
                hidden?: boolean | undefined;
                usage?: {
                    prompt_tokens?: number | undefined;
                    completion_tokens?: number | undefined;
                    total_tokens?: number | undefined;
                } | undefined;
                isStreaming?: boolean | undefined;
                _id?: string | undefined;
                created_at?: string | undefined;
                created_by?: string | undefined;
                updated_at?: string | undefined;
            }[] | undefined;
            tokens?: number | undefined;
            model?: string | undefined;
            metadata?: Record<string, any> | undefined;
            status: ChatMessageStatus;
            error?: string | undefined;
            usage?: {
                prompt_tokens?: number | undefined;
                completion_tokens?: number | undefined;
                total_tokens?: number | undefined;
            } | undefined;
            timestamp?: Date | undefined;
            isStreaming?: boolean | undefined;
            _id?: string | undefined;
            created_at?: string | undefined;
            created_by?: string | undefined;
            updated_at?: string | undefined;
        }[] | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
        _id?: string | undefined;
        created_by?: string | undefined;
    }[], ChatConversation[] | {
        [x: string]: any;
        title?: string | undefined;
        description?: string | undefined;
        user_id?: string | undefined;
        model?: string | undefined;
        status?: ChatConversationStatus | undefined;
        last_message_at?: string | undefined;
        settings?: Record<string, any> | undefined;
        tags?: string[] | undefined;
        messages?: {
            [x: string]: any;
            conversation_id: string;
            role: ChatMessageRole;
            content?: string | undefined;
            content_ids?: string[] | undefined;
            contents?: {
                [x: string]: any;
                message_id?: string | undefined;
                key?: string | undefined;
                parameters?: Record<string, any> | undefined;
                content?: string | undefined;
                type: ChatMessageContentType;
                action?: string | undefined;
                action_target?: string | undefined;
                action_status?: ChatMessageActionStatus | undefined;
                hidden?: boolean | undefined;
                usage?: {
                    prompt_tokens?: number | undefined;
                    completion_tokens?: number | undefined;
                    total_tokens?: number | undefined;
                } | undefined;
                isStreaming?: boolean | undefined;
                _id?: string | undefined;
                created_at?: string | undefined;
                created_by?: string | undefined;
                updated_at?: string | undefined;
            }[] | undefined;
            tokens?: number | undefined;
            model?: string | undefined;
            metadata?: Record<string, any> | undefined;
            status: ChatMessageStatus;
            error?: string | undefined;
            usage?: {
                prompt_tokens?: number | undefined;
                completion_tokens?: number | undefined;
                total_tokens?: number | undefined;
            } | undefined;
            timestamp?: Date | undefined;
            isStreaming?: boolean | undefined;
            _id?: string | undefined;
            created_at?: string | undefined;
            created_by?: string | undefined;
            updated_at?: string | undefined;
        }[] | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
        _id?: string | undefined;
        created_by?: string | undefined;
    }[]>;
    chatHistory: import("vue").Reactive<ChatMessage[]>;
    isGenerating: import("vue").Ref<boolean, boolean>;
    streamError: import("vue").Ref<string, string>;
    isLoadingConversations: import("vue").Ref<boolean, boolean>;
    isLoadingMessages: import("vue").Ref<boolean, boolean>;
    historyDialogVisible: import("vue").Ref<boolean, boolean>;
    configDialogVisible: import("vue").Ref<boolean, boolean>;
    abortController: import("vue").Ref<{
        readonly signal: {
            readonly aborted: boolean;
            onabort: ((this: AbortSignal, ev: Event) => any) | null;
            readonly reason: any;
            throwIfAborted: {
                (): void;
                (): void;
            };
            addEventListener: {
                <K extends keyof AbortSignalEventMap>(type: K, listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
                (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
            };
            removeEventListener: {
                <K extends keyof AbortSignalEventMap>(type: K, listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
                (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
            };
            dispatchEvent: (event: Event) => boolean;
        };
        abort: {
            (reason?: any): void;
            (reason?: any): void;
        };
    } | null, AbortController | {
        readonly signal: {
            readonly aborted: boolean;
            onabort: ((this: AbortSignal, ev: Event) => any) | null;
            readonly reason: any;
            throwIfAborted: {
                (): void;
                (): void;
            };
            addEventListener: {
                <K extends keyof AbortSignalEventMap>(type: K, listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
                (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
            };
            removeEventListener: {
                <K extends keyof AbortSignalEventMap>(type: K, listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
                (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
            };
            dispatchEvent: (event: Event) => boolean;
        };
        abort: {
            (reason?: any): void;
            (reason?: any): void;
        };
    } | null>;
    availableProviders: import("vue").Ref<{
        [x: string]: any;
        type?: LLMProviderType | undefined;
        name?: string | undefined;
        api_key?: string | undefined;
        api_base_url?: string | undefined;
        api_version?: string | undefined;
        models?: string[] | undefined;
        default_model?: string | undefined;
        _id?: string | undefined;
        created_at?: string | undefined;
        created_by?: string | undefined;
        updated_at?: string | undefined;
    }[], LLMProvider[] | {
        [x: string]: any;
        type?: LLMProviderType | undefined;
        name?: string | undefined;
        api_key?: string | undefined;
        api_base_url?: string | undefined;
        api_version?: string | undefined;
        models?: string[] | undefined;
        default_model?: string | undefined;
        _id?: string | undefined;
        created_at?: string | undefined;
        created_by?: string | undefined;
        updated_at?: string | undefined;
    }[]>;
    chatbotConfig: import("vue").Ref<{
        providerId?: string | undefined;
        model?: string | undefined;
        systemPrompt?: string | undefined;
        temperature?: number | undefined;
        maxTokens?: number | undefined;
    }, ChatbotConfig | {
        providerId?: string | undefined;
        model?: string | undefined;
        systemPrompt?: string | undefined;
        temperature?: number | undefined;
        maxTokens?: number | undefined;
    }>;
    currentConversationTitle: import("vue").ComputedRef<string>;
    loadConversations: () => Promise<void>;
    loadConversationMessages: import("lodash").DebouncedFunc<(conversationId: string) => Promise<void>>;
    loadCurrentConversation: import("lodash").DebouncedFunc<(conversationId: string) => Promise<void>>;
    loadLLMProviders: import("lodash").DebouncedFunc<() => Promise<void>>;
    loadChatbotConfig: () => void;
    saveChatbotConfig: (config: ChatbotConfig) => void;
    resetChatbotConfig: () => void;
    selectConversation: (conversationId: string) => Promise<void>;
    createNewConversation: () => void;
    sendStreamingRequest: (message: string, responseIndex: number, onMessageUpdate: (index: number) => void) => Promise<void>;
    extractErrorMessage: (errorData: string) => string;
    initializeConversation: () => Promise<void>;
};
export default useAssistantConsole;
