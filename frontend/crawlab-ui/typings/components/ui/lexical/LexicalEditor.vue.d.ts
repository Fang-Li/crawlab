import '@/components/ui/lexical/theme/default.css';
type __VLS_Props = {
    markdownContent?: string;
};
type __VLS_PublicProps = __VLS_Props & {
    modelValue: RichTextPayload;
};
declare const _default: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: RichTextPayload) => any;
} & {
    save: () => any;
    "change-markdown": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    onSave?: (() => any) | undefined;
    "onChange-markdown"?: ((value: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: RichTextPayload) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
