type __VLS_Props = {
    item: DraggableItemData;
    dragging?: boolean;
};
type __VLS_Emit = {
    (e: 'd-start', item: DraggableItemData): void;
    (e: 'd-end', item: DraggableItemData): void;
    (e: 'd-enter', item: DraggableItemData): void;
    (e: 'd-leave', item: DraggableItemData): void;
};
declare const emit: __VLS_Emit;
declare const classes: import("vue").ComputedRef<string[]>;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_1: {
    item: DraggableItemData;
};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    default?: (props: typeof __VLS_1) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    emit: typeof emit;
    classes: typeof classes;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "d-start": (item: DraggableItemData) => any;
    "d-end": (item: DraggableItemData) => any;
    "d-enter": (item: DraggableItemData) => any;
    "d-leave": (item: DraggableItemData) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onD-start"?: ((item: DraggableItemData) => any) | undefined;
    "onD-end"?: ((item: DraggableItemData) => any) | undefined;
    "onD-enter"?: ((item: DraggableItemData) => any) | undefined;
    "onD-leave"?: ((item: DraggableItemData) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "d-start": (item: DraggableItemData) => any;
    "d-end": (item: DraggableItemData) => any;
    "d-enter": (item: DraggableItemData) => any;
    "d-leave": (item: DraggableItemData) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onD-start"?: ((item: DraggableItemData) => any) | undefined;
    "onD-end"?: ((item: DraggableItemData) => any) | undefined;
    "onD-enter"?: ((item: DraggableItemData) => any) | undefined;
    "onD-leave"?: ((item: DraggableItemData) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
