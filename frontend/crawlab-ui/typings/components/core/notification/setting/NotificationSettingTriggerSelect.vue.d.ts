type __VLS_Props = {
    disabled?: boolean;
};
type __VLS_PublicProps = __VLS_Props & {
    modelValue?: NotificationTrigger;
};
declare const _default: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: NotificationTrigger | undefined) => any;
} & {
    "trigger-change": (value: NotificationTrigger) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onTrigger-change"?: ((value: NotificationTrigger) => any) | undefined;
    "onUpdate:modelValue"?: ((value: NotificationTrigger | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
