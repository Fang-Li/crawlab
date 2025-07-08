type __VLS_Props = {
    database?: DatabaseDatabase;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "click-table": (table: DatabaseTable, type: DatabaseTableClickRowType) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onClick-table"?: ((table: DatabaseTable, type: DatabaseTableClickRowType) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
