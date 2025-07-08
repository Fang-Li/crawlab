import type { ContextMenuItem, ContextMenuProps } from '@/components/ui/context-menu/types';
type __VLS_Props = ContextMenuProps & {
    tabs?: FileNavItem[];
};
type __VLS_Emit = {
    (e: 'hide'): void;
    (e: 'tab-click', tab: FileNavItem): void;
};
declare const emit: __VLS_Emit;
declare const items: import("vue").ComputedRef<ContextMenuItem[]>;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_18: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    default?: (props: typeof __VLS_18) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    emit: typeof emit;
    items: typeof items;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    hide: () => any;
    "tab-click": (tab: FileNavItem) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onHide?: (() => any) | undefined;
    "onTab-click"?: ((tab: FileNavItem) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    hide: () => any;
    "tab-click": (tab: FileNavItem) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onHide?: (() => any) | undefined;
    "onTab-click"?: ((tab: FileNavItem) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
