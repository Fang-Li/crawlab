type __VLS_Props = {
    tooltip?: string | Record<string, string>;
    isHtml?: boolean;
    icon?: string | string[];
    status?: TableHeaderActionStatus;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClick?: (() => any) | undefined;
}>, {
    status: TableHeaderActionStatus;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
