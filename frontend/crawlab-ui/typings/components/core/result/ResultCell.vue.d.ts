type __VLS_Props = {
    fieldKey?: string;
    type: DataFieldType;
    value?: string | number | boolean | Array<any> | Record<string, any>;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClick?: (() => any) | undefined;
}>, {
    type: DataFieldType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
