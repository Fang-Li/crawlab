import { ElInput } from 'element-plus';
import { ClIcon } from '@/components';
type __VLS_Props = {
    modelValue?: any;
    initialEditState?: boolean;
    required?: boolean;
    placeholder?: string;
    autoFocus?: boolean;
    readonly?: boolean;
    inputType?: string;
    height?: number | string;
    displayValue?: string;
};
declare const t: (path: string, number?: number | null, args?: Record<string, any>) => string;
declare const inputRef: import("vue").Ref<any, any>;
declare const isEdit: import("vue").Ref<boolean, boolean>;
declare const internalValue: import("vue").Ref<string, string>;
declare const hasError: import("vue").ComputedRef<boolean>;
declare const shouldShowEmptyPlaceholder: import("vue").ComputedRef<boolean>;
declare const onEdit: () => void;
declare const onCheck: () => void;
declare const CellActions: () => JSX.Element;
declare const onEnterKeyDown: (event: Event | KeyboardEvent) => void;
declare const onBlur: () => void;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_1: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    default?: (props: typeof __VLS_1) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    ElInput: typeof ElInput;
    ClIcon: typeof ClIcon;
    t: typeof t;
    inputRef: typeof inputRef;
    isEdit: typeof isEdit;
    internalValue: typeof internalValue;
    hasError: typeof hasError;
    shouldShowEmptyPlaceholder: typeof shouldShowEmptyPlaceholder;
    onEdit: typeof onEdit;
    onCheck: typeof onCheck;
    CellActions: typeof CellActions;
    onEnterKeyDown: typeof onEnterKeyDown;
    onBlur: typeof onBlur;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    edit: (val: boolean) => any;
    change: (val: any) => any;
    "update:modelValue": (val: any) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onEdit?: ((val: boolean) => any) | undefined;
    onChange?: ((val: any) => any) | undefined;
    "onUpdate:modelValue"?: ((val: any) => any) | undefined;
}>, {
    height: number | string;
    autoFocus: boolean;
    inputType: string;
    initialEditState: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    edit: (val: boolean) => any;
    change: (val: any) => any;
    "update:modelValue": (val: any) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onEdit?: ((val: boolean) => any) | undefined;
    onChange?: ((val: any) => any) | undefined;
    "onUpdate:modelValue"?: ((val: any) => any) | undefined;
}>, {
    height: number | string;
    autoFocus: boolean;
    inputType: string;
    initialEditState: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
