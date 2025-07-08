type __VLS_Props = {
    isMaster?: boolean;
    label?: string;
    tooltip?: string;
    showFullLabel?: boolean;
    clickable?: boolean;
};
declare const type: import("vue").ComputedRef<BasicType>;
declare const computedLabel: import("vue").ComputedRef<string>;
declare const icon: import("vue").ComputedRef<string[]>;
declare const className: import("vue").ComputedRef<string>;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_5: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    tooltip?: (props: typeof __VLS_5) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    type: typeof type;
    computedLabel: typeof computedLabel;
    icon: typeof icon;
    className: typeof className;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
