type __VLS_Props = {
    visible?: boolean;
};
type __VLS_PublicProps = __VLS_Props & {
    modelValue: NotificationVariable | undefined;
};
declare const _default: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: NotificationVariable | undefined) => any;
} & {
    confirm: () => any;
    close: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    onConfirm?: (() => any) | undefined;
    onClose?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: NotificationVariable | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
