type __VLS_Props = {
    modelValue: string[];
    placeholder: string;
    size: BasicSize;
    actionSize: BasicSize;
    disabled: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (value: string[]) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:model-value"?: ((value: string[]) => any) | undefined;
}>, {
    placeholder: string;
    size: BasicSize;
    modelValue: string[];
    actionSize: BasicSize;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
