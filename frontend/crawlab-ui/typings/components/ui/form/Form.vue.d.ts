type __VLS_Props = {
    id?: string;
    model?: FormModel;
    inline?: boolean;
    labelWidth?: string;
    size?: string;
    grid?: number;
    rules?: FormRules;
};
type __VLS_Emit = {
    (e: 'validate'): void;
};
declare const emit: __VLS_Emit;
declare const formRef: import("vue").Ref<any, any>;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_11: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    default?: (props: typeof __VLS_11) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    emit: typeof emit;
    formRef: typeof formRef;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    validate: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onValidate?: (() => any) | undefined;
}>, {
    size: string;
    grid: number;
    inline: boolean;
    labelWidth: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {
    validate: () => Promise<any>;
    resetFields: () => any;
    clearValidate: () => any;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    validate: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onValidate?: (() => any) | undefined;
}>, {
    size: string;
    grid: number;
    inline: boolean;
    labelWidth: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
