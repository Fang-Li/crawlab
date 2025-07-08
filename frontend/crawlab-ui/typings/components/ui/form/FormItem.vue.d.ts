import { StyleValue } from 'vue';
import { RuleItem } from 'async-validator';
type __VLS_Props = {
    prop?: string;
    label?: string;
    labelTooltip?: string;
    labelWidth?: string;
    size?: string;
    required?: boolean;
    span?: number;
    offset?: number;
    rules?: RuleItem | RuleItem[];
    notEditable?: boolean;
    noLabel?: boolean;
};
declare const formItem: import("vue").Ref<HTMLDivElement | undefined, HTMLDivElement | undefined>;
declare const formContext: FormContext;
declare const isSelectiveForm: import("vue").ComputedRef<boolean | undefined>;
declare const style: import("vue").ComputedRef<StyleValue>;
declare const internalEditable: import("vue").Ref<boolean, boolean>;
declare const editableTooltip: import("vue").ComputedRef<string>;
declare const onEditableChange: (value: boolean) => void;
declare const isRequired: import("vue").ComputedRef<boolean>;
declare const showRequiredAsterisk: import("vue").ComputedRef<boolean>;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_21: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    default?: (props: typeof __VLS_21) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    formItem: typeof formItem;
    formContext: typeof formContext;
    isSelectiveForm: typeof isSelectiveForm;
    style: typeof style;
    internalEditable: typeof internalEditable;
    editableTooltip: typeof editableTooltip;
    onEditableChange: typeof onEditableChange;
    isRequired: typeof isRequired;
    showRequiredAsterisk: typeof showRequiredAsterisk;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    span: number;
    offset: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    span: number;
    offset: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
