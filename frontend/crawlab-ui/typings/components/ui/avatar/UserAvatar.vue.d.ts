type __VLS_Props = {
    icon?: Icon;
    size?: BasicSize | number;
    shape?: 'circle' | 'square';
    src?: string;
    alt?: string;
    fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    color?: string;
    user?: User;
    tooltip?: string;
};
type __VLS_Slots = {
    default: any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: MouseEvent) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
}>, {
    size: BasicSize | number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
