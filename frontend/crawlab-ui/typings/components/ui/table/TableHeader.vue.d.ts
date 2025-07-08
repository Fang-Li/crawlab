type __VLS_Props = {
    column: TableColumn;
    index?: number;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (column: TableColumn<any>, sort?: SortData | undefined, filter?: TableHeaderDialogFilterData | undefined) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((column: TableColumn<any>, sort?: SortData | undefined, filter?: TableHeaderDialogFilterData | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
