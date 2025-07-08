type __VLS_Props = {
    id?: string;
    prefixIcon?: Icon;
    label?: string;
    placeholder?: string;
    defaultValue?: any;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    clear: () => any;
    change: (value: any) => any;
    enter: (value: any) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClear?: (() => any) | undefined;
    onChange?: ((value: any) => any) | undefined;
    onEnter?: ((value: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
