type __VLS_Props = {
    options: CheckboxTreeSelectOption[];
    disabled?: boolean;
    checkedAll?: boolean;
};
type __VLS_PublicProps = __VLS_Props & {
    modelValue?: any[];
};
declare const _default: import("vue").DefineComponent<__VLS_PublicProps, {
    getCheckAllStatus: () => CheckboxStatus;
    checkAll: (checked: boolean) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: any[] | undefined) => any;
} & {
    change: (value: any[]) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    onChange?: ((value: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((value: any[] | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
