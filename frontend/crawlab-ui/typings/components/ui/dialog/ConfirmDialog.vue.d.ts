type __VLS_Props = {
    confirmFunc: () => Promise<void>;
    title: string;
    content?: string;
};
declare const visible: import("vue").Ref<boolean, boolean>;
declare const confirmLoading: import("vue").Ref<boolean, boolean>;
declare const onCancel: () => void;
declare const onConfirm: () => Promise<void>;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_11: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    default?: (props: typeof __VLS_11) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    visible: typeof visible;
    confirmLoading: typeof confirmLoading;
    onCancel: typeof onCancel;
    onConfirm: typeof onConfirm;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    cancel: () => any;
    confirm: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onCancel?: (() => any) | undefined;
    onConfirm?: (() => any) | undefined;
}>, {
    confirmFunc: () => Promise<void>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    cancel: () => any;
    confirm: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onCancel?: (() => any) | undefined;
    onConfirm?: (() => any) | undefined;
}>, {
    confirmFunc: () => Promise<void>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
