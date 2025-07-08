type __VLS_Props = {
    loading?: boolean;
    modelValue?: LLMProvider;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    validate: () => Promise<void>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:modelValue": (value: LLMProvider) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: LLMProvider) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
