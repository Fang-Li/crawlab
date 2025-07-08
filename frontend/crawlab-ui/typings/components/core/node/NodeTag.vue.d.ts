type __VLS_Props = {
    node: CNode;
    icon?: Icon;
    size?: BasicSize;
    type?: BasicType;
    tooltip?: string;
    clickable?: boolean;
    loading?: boolean;
    effect?: BasicEffect;
    hit?: boolean;
    iconOnly?: boolean;
    noLabel?: boolean;
};
type __VLS_Slots = {
    tooltip: any;
    'extra-items': any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: () => any;
    mouseenter: () => any;
    mouseleave: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClick?: (() => any) | undefined;
    onMouseenter?: (() => any) | undefined;
    onMouseleave?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
