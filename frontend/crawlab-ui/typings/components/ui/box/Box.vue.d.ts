type __VLS_Props = {
    visible?: boolean;
    title?: string;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    closable?: boolean;
    type?: BasicType;
    icon?: Icon;
    loading?: boolean;
    zIndex?: number;
};
declare const cls: import("vue").ComputedRef<string>;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_13: {}, __VLS_15: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    title?: (props: typeof __VLS_13) => any;
} & {
    default?: (props: typeof __VLS_15) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    cls: typeof cls;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    close: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClose?: (() => any) | undefined;
}>, {
    position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    closable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    close: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClose?: (() => any) | undefined;
}>, {
    position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    closable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
