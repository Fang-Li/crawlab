import { ClickOutside as vClickOutside } from 'element-plus';
type __VLS_Props = {
    visible?: boolean;
    column: TableColumn;
    actionStatusMap: TableHeaderActionStatusMap;
    sort?: SortData;
    filter?: TableHeaderDialogFilterData;
};
declare const t: (path: string, number?: number | null, args?: Record<string, any>) => string;
declare const internalSort: import("vue").Ref<SortData | undefined, SortData | undefined>;
declare const searchString: import("vue").ComputedRef<string | undefined>;
declare const conditions: import("vue").ComputedRef<FilterConditionData[]>;
declare const isApplyDisabled: import("vue").ComputedRef<boolean>;
declare const onClickOutside: () => void;
declare const onCancel: () => void;
declare const onClear: () => void;
declare const onApply: () => void;
declare const onSortChange: (value: string) => void;
declare const onFilterChange: (value: TableHeaderDialogFilterData) => void;
declare const onFilterEnter: () => void;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_6: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    reference?: (props: typeof __VLS_6) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    vClickOutside: typeof vClickOutside;
    t: typeof t;
    internalSort: typeof internalSort;
    searchString: typeof searchString;
    conditions: typeof conditions;
    isApplyDisabled: typeof isApplyDisabled;
    onClickOutside: typeof onClickOutside;
    onCancel: typeof onCancel;
    onClear: typeof onClear;
    onApply: typeof onApply;
    onSortChange: typeof onSortChange;
    onFilterChange: typeof onFilterChange;
    onFilterEnter: typeof onFilterEnter;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    cancel: () => any;
    clear: () => any;
    apply: (value: TableHeaderDialogValue) => any;
    click: (value: TableHeaderDialogValue) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onCancel?: (() => any) | undefined;
    onClear?: (() => any) | undefined;
    onApply?: ((value: TableHeaderDialogValue) => any) | undefined;
    onClick?: ((value: TableHeaderDialogValue) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    cancel: () => any;
    clear: () => any;
    apply: (value: TableHeaderDialogValue) => any;
    click: (value: TableHeaderDialogValue) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onCancel?: (() => any) | undefined;
    onClear?: (() => any) | undefined;
    onApply?: ((value: TableHeaderDialogValue) => any) | undefined;
    onClick?: ((value: TableHeaderDialogValue) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
