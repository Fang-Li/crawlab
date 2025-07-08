type __VLS_Props = {
    visible: boolean;
    modalClass?: string;
    title?: string;
    titleIcon?: Icon;
    top?: string;
    width?: string;
    zIndex?: number;
    confirmDisabled?: boolean;
    confirmLoading?: boolean;
    confirmType?: BasicType;
    confirmText?: string;
    className?: string;
    appendToBody?: boolean;
};
declare const t: (path: string, number?: number | null, args?: Record<string, any>) => string;
declare const onClose: () => void;
declare const onConfirm: () => void;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_6: {}, __VLS_8: {}, __VLS_14: {}, __VLS_32: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    default?: (props: typeof __VLS_6) => any;
} & {
    title?: (props: typeof __VLS_8) => any;
} & {
    prefix?: (props: typeof __VLS_14) => any;
} & {
    suffix?: (props: typeof __VLS_32) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    t: typeof t;
    onClose: typeof onClose;
    onConfirm: typeof onConfirm;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    confirm: () => any;
    close: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onConfirm?: (() => any) | undefined;
    onClose?: (() => any) | undefined;
}>, {
    top: string;
    appendToBody: boolean;
    confirmType: BasicType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    confirm: () => any;
    close: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onConfirm?: (() => any) | undefined;
    onClose?: (() => any) | undefined;
}>, {
    top: string;
    appendToBody: boolean;
    confirmType: BasicType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
