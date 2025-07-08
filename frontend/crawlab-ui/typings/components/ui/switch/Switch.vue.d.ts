type __VLS_Props = {
    modelValue?: boolean;
    disabled?: boolean;
    activeColor?: string;
    inactiveColor?: string;
    activeIcon?: Icon;
    inactiveIcon?: Icon;
    activeText?: string;
    inactiveText?: string;
    width?: number;
    loading?: boolean;
    inlinePrompt?: boolean;
    tooltip?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (value: boolean) => any;
    "update:model-value": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((value: boolean) => any) | undefined;
    "onUpdate:model-value"?: ((value: boolean) => any) | undefined;
}>, {
    width: number;
    activeColor: string;
    inactiveColor: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
