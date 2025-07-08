import { ColumnCls } from 'element-plus/es/components/table/src/table/defaults';
import { CellCls, CellStyle, ColumnStyle } from 'element-plus';
type __VLS_Slots = {
    tabs?: any;
    'nav-actions-extra'?: any;
    'table-empty'?: any;
    extra?: any;
};
type __VLS_Props = {
    navActions?: ListActionGroup[];
    rowKey?: string | ((row: any) => string);
    tableColumns: TableColumns;
    tableData: TableData;
    tableTotal?: number;
    tablePagination?: TablePagination;
    tablePageSizes?: number[];
    tableListFilter?: FilterConditionData[];
    tableListSort?: SortData[];
    tableActionsPrefix?: ListActionButton[];
    tableActionsSuffix?: ListActionButton[];
    tableFilter?: any;
    tablePaginationLayout?: string;
    tableLoading?: boolean;
    tableRowClassName?: ColumnCls<any>;
    tableRowStyle?: ColumnStyle<any>;
    tableCellClassName?: CellCls<any>;
    tableCellStyle?: CellStyle<any>;
    tableHeaderRowClassName?: ColumnCls<any>;
    tableHeaderRowStyle?: ColumnStyle<any>;
    tableHeaderCellClassName?: CellCls<any>;
    tableHeaderCellStyle?: CellStyle<any>;
    actionFunctions?: ListLayoutActionFunctions;
    noActions?: boolean;
    selectable?: boolean;
    selectableFunction?: TableSelectableFunction;
    visibleButtons?: BuiltInTableActionButtonName[];
    embedded?: boolean;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    select: (value: TableData<TableAnyRowData>) => any;
    edit: (value: TableData<TableAnyRowData>) => any;
    delete: (value: TableData<TableAnyRowData>) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((value: TableData<TableAnyRowData>) => any) | undefined;
    onEdit?: ((value: TableData<TableAnyRowData>) => any) | undefined;
    onDelete?: ((value: TableData<TableAnyRowData>) => any) | undefined;
}>, {
    navActions: ListActionGroup[];
    rowKey: string | ((row: any) => string);
    tableColumns: TableColumns;
    tableData: TableData;
    tableTotal: number;
    tablePagination: TablePagination;
    tableListFilter: FilterConditionData[];
    tableListSort: SortData[];
    tableActionsPrefix: ListActionButton[];
    tableActionsSuffix: ListActionButton[];
    tableFilter: any;
    noActions: boolean;
    selectable: boolean;
    selectableFunction: TableSelectableFunction;
    visibleButtons: BuiltInTableActionButtonName[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
