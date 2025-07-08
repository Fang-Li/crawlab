import type { ButtonProps, ButtonEmits } from './types';
declare const emit: ButtonEmits;
declare const cls: import("vue").ComputedRef<string>;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_16: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    default?: (props: typeof __VLS_16) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<ButtonProps, {
    emit: typeof emit;
    cls: typeof cls;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: Event) => any;
    mouseenter: (event: Event) => any;
    mouseleave: (event: Event) => any;
}, string, import("vue").PublicProps, Readonly<ButtonProps> & Readonly<{
    onClick?: ((event: Event) => any) | undefined;
    onMouseenter?: ((event: Event) => any) | undefined;
    onMouseleave?: ((event: Event) => any) | undefined;
}>, {
    type: BasicType;
    size: BasicSize;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<ButtonProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: Event) => any;
    mouseenter: (event: Event) => any;
    mouseleave: (event: Event) => any;
}, string, import("vue").PublicProps, Readonly<ButtonProps> & Readonly<{
    onClick?: ((event: Event) => any) | undefined;
    onMouseenter?: ((event: Event) => any) | undefined;
    onMouseleave?: ((event: Event) => any) | undefined;
}>, {
    type: BasicType;
    size: BasicSize;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
