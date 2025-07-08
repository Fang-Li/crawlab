type __VLS_Props = {
    column?: TableColumn;
    searchString?: string;
    conditions: FilterConditionData[];
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    clear: () => any;
    change: (value: TableHeaderDialogFilterData) => any;
    enter: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClear?: (() => any) | undefined;
    onChange?: ((value: TableHeaderDialogFilterData) => any) | undefined;
    onEnter?: (() => any) | undefined;
}>, {
    conditions: FilterConditionData[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
