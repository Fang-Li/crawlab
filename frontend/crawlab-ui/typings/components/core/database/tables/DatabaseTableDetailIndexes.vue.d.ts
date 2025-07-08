type __VLS_Props = {
    loading?: boolean;
    activeTable?: DatabaseTable;
};
type __VLS_PublicProps = __VLS_Props & {
    modelValue?: DatabaseTable;
};
declare const _default: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: DatabaseTable | undefined) => any;
} & {
    change: (value: DatabaseTable) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    onChange?: ((value: DatabaseTable) => any) | undefined;
    "onUpdate:modelValue"?: ((value: DatabaseTable | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
