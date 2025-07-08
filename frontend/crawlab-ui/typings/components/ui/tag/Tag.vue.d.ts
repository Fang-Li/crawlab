import type { TagProps } from './types';
type __VLS_Slots = {
    default: any;
    tooltip: any;
};
declare const __VLS_component: import("vue").DefineComponent<TagProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    close: () => any;
    click: () => any;
    mouseenter: () => any;
    mouseleave: () => any;
}, string, import("vue").PublicProps, Readonly<TagProps> & Readonly<{
    onClose?: (() => any) | undefined;
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
