import { Placement } from '@popperjs/core';
type __VLS_Props = {
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    size?: BasicSize;
    placement?: Placement;
    filterable?: boolean;
    clearable?: boolean;
    remoteShowSuffix?: boolean;
    endpoint: string;
    labelKey?: string;
    valueKey?: string;
    limit?: number;
    emptyOption?: SelectOption;
};
type __VLS_Emit = {
    (e: 'change', value: string): void;
    (e: 'select', value: string): void;
    (e: 'clear'): void;
    (e: 'update:model-value', value: string): void;
};
declare const emit: __VLS_Emit;
declare const internalValue: import("vue").Ref<string | undefined, string | undefined>;
declare const remoteMethod: (query?: string) => Promise<void>;
declare const selectOptions: import("vue").ComputedRef<SelectOption<any>[]>;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_15: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    label?: (props: typeof __VLS_15) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    emit: typeof emit;
    internalValue: typeof internalValue;
    remoteMethod: typeof remoteMethod;
    selectOptions: typeof selectOptions;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    select: (value: string) => any;
    clear: () => any;
    change: (value: string) => any;
    "update:model-value": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((value: string) => any) | undefined;
    onClear?: (() => any) | undefined;
    onChange?: ((value: string) => any) | undefined;
    "onUpdate:model-value"?: ((value: string) => any) | undefined;
}>, {
    filterable: boolean;
    remoteShowSuffix: boolean;
    valueKey: string;
    limit: number;
    labelKey: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {
    getSelectedItem: () => any;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    select: (value: string) => any;
    clear: () => any;
    change: (value: string) => any;
    "update:model-value": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((value: string) => any) | undefined;
    onClear?: (() => any) | undefined;
    onChange?: ((value: string) => any) | undefined;
    "onUpdate:model-value"?: ((value: string) => any) | undefined;
}>, {
    filterable: boolean;
    remoteShowSuffix: boolean;
    valueKey: string;
    limit: number;
    labelKey: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
