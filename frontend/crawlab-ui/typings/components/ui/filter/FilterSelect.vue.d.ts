type __VLS_Props = {
    id?: string;
    label?: string;
    placeholder?: string;
    filterable?: boolean;
    clearable?: boolean;
    options?: SelectOption[];
    optionsRemote?: FilterSelectOptionsRemote;
    noAllOption?: boolean;
    defaultValue?: any;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (value: any) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((value: any) => any) | undefined;
}>, {
    clearable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
