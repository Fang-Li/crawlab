import type { ContextMenuItem, ContextMenuProps } from '@/components/ui/context-menu/types';
type __VLS_Emit = {
    (e: 'hide'): void;
    (e: 'new-file'): void;
    (e: 'new-directory'): void;
    (e: 'upload-files'): void;
    (e: 'rename'): void;
    (e: 'clone'): void;
    (e: 'delete'): void;
    (e: 'create-spider'): void;
    (e: 'delete-spider'): void;
};
declare const emit: __VLS_Emit;
declare const items: import("vue").ComputedRef<ContextMenuItem[]>;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_18: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    default?: (props: typeof __VLS_18) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<ContextMenuProps, {
    emit: typeof emit;
    items: typeof items;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<ContextMenuProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    placement: import("@popperjs/core").Placement;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<ContextMenuProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<ContextMenuProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    placement: import("@popperjs/core").Placement;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
