import { getIconByNavItem } from '@/utils';
declare const t: (path: string, number?: number | null, args?: Record<string, any>) => string;
type __VLS_Props = {
    items?: NavItem[];
    activeKey?: string;
};
declare const onSelect: (index: string) => void;
declare const getClassName: (item: NavItem) => string;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_25: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    extra?: (props: typeof __VLS_25) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    getIconByNavItem: typeof getIconByNavItem;
    t: typeof t;
    onSelect: typeof onSelect;
    getClassName: typeof getClassName;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    select: (index: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((index: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    select: (index: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((index: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
