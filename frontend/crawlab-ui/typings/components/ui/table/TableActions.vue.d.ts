import { ACTION_DELETE, ACTION_EDIT } from '@/constants/action';
import { TABLE_ACTION_CUSTOMIZE_COLUMNS, TABLE_ACTION_EXPORT } from '@/constants/table';
type __VLS_Props = {
    selection: TableData;
    visibleButtons: BuiltInTableActionButtonName[];
    hide?: boolean;
};
declare const t: (path: string, number?: number | null, args?: Record<string, any>) => string;
declare const onEdit: () => void;
declare const onDelete: () => Promise<void>;
declare const onExport: () => void;
declare const onCustomizeColumns: () => void;
declare const showButton: (name: string) => boolean;
declare const target: () => string;
declare const conditions: () => FilterConditionData[];
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_1: {}, __VLS_35: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    prefix?: (props: typeof __VLS_1) => any;
} & {
    suffix?: (props: typeof __VLS_35) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    ACTION_DELETE: typeof ACTION_DELETE;
    ACTION_EDIT: typeof ACTION_EDIT;
    TABLE_ACTION_CUSTOMIZE_COLUMNS: typeof TABLE_ACTION_CUSTOMIZE_COLUMNS;
    TABLE_ACTION_EXPORT: typeof TABLE_ACTION_EXPORT;
    t: typeof t;
    onEdit: typeof onEdit;
    onDelete: typeof onDelete;
    onExport: typeof onExport;
    onCustomizeColumns: typeof onCustomizeColumns;
    showButton: typeof showButton;
    target: typeof target;
    conditions: typeof conditions;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    edit: () => any;
    delete: () => any;
    export: () => any;
    "customize-columns": () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onEdit?: (() => any) | undefined;
    onDelete?: (() => any) | undefined;
    onExport?: (() => any) | undefined;
    "onCustomize-columns"?: (() => any) | undefined;
}>, {
    selection: TableData;
    visibleButtons: BuiltInTableActionButtonName[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    edit: () => any;
    delete: () => any;
    export: () => any;
    "customize-columns": () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onEdit?: (() => any) | undefined;
    onDelete?: (() => any) | undefined;
    onExport?: (() => any) | undefined;
    "onCustomize-columns"?: (() => any) | undefined;
}>, {
    selection: TableData;
    visibleButtons: BuiltInTableActionButtonName[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
