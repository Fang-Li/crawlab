type __VLS_Props = {
    visible?: boolean;
};
type __VLS_PublicProps = __VLS_Props & {
    modelValue: ImageForm;
};
declare const _default: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: ImageForm) => any;
} & {
    confirm: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    onConfirm?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: ImageForm) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
