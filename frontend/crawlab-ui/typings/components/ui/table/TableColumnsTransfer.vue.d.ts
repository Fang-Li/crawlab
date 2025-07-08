type __VLS_Props = {
    visible?: boolean;
    columns?: TableColumn[];
    selectedColumnKeys?: string[];
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    sort: (value: string[]) => any;
    confirm: (value: string[]) => any;
    change: (value: string[]) => any;
    close: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSort?: ((value: string[]) => any) | undefined;
    onConfirm?: ((value: string[]) => any) | undefined;
    onChange?: ((value: string[]) => any) | undefined;
    onClose?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
