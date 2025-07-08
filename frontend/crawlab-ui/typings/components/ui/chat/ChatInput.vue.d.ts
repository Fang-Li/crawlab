type __VLS_Props = {
    isLoading?: boolean;
    providers?: LLMProvider[];
    selectedProviderModel?: LLMProviderModel;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    focus: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    cancel: () => any;
    send: (message: string) => any;
    "model-change": (value: LLMProviderModel) => any;
    "add-model": () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onCancel?: (() => any) | undefined;
    onSend?: ((message: string) => any) | undefined;
    "onModel-change"?: ((value: LLMProviderModel) => any) | undefined;
    "onAdd-model"?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
