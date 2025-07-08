type __VLS_Props = {
    tabsItems: NavItem[];
    canSave?: boolean;
    hasChanges?: boolean;
    commitLoading?: boolean;
};
type __VLS_PublicProps = __VLS_Props & {
    modelValue?: any;
};
declare const _default: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: any) => any;
} & {
    commit: () => any;
    rollback: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    onCommit?: (() => any) | undefined;
    onRollback?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
