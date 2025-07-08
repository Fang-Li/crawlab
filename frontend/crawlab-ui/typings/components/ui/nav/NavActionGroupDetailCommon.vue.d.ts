type __VLS_Props = {
    disabled?: boolean;
    showBackButton?: boolean;
    showSaveButton?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    save: () => any;
    back: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSave?: (() => any) | undefined;
    onBack?: (() => any) | undefined;
}>, {
    disabled: boolean;
    showBackButton: boolean;
    showSaveButton: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
