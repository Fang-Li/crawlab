type __VLS_Props = {
    option: CheckboxTreeSelectOption;
    state: {
        checked: boolean;
        intermediate: boolean;
    };
    disabled?: boolean;
    checkedAll?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:state": (checked: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:state"?: ((checked: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
