import { CellCls, CellStyle, ColumnStyle } from 'element-plus';
import { ColumnCls } from 'element-plus/es/components/table/src/table/defaults';
type __VLS_Slots = {
    empty?: void;
    'actions-prefix'?: void;
    'actions-suffix'?: void;
};
type __VLS_Props = {
    loading?: boolean;
    data: TableData;
    columns: TableColumn[];
    selectedColumnKeys?: string[];
    total?: number;
    page?: number;
    pageSize?: number;
    pageSizes?: number[];
    paginationLayout?: string;
    paginationPosition?: TablePaginationPosition;
    rowKey?: string | ((row: any) => string);
    selectable?: boolean;
    visibleButtons?: BuiltInTableActionButtonName[];
    hideFooter?: boolean;
    selectableFunction?: TableSelectableFunction;
    height?: string | number;
    maxHeight?: string | number;
    embedded?: boolean;
    border?: boolean;
    fit?: boolean;
    emptyText?: string;
    rowClassName?: ColumnCls<any>;
    rowStyle?: ColumnStyle<any>;
    cellClassName?: CellCls<any>;
    cellStyle?: CellStyle<any>;
    headerRowClassName?: ColumnCls<any>;
    headerRowStyle?: ColumnStyle<any>;
    headerCellClassName?: CellCls<any>;
    headerCellStyle?: CellStyle<any>;
    stickyHeader?: boolean;
    hideDefaultActions?: boolean;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {
    clearSelection: () => void;
    checkAll: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    edit: (data: TableData<TableAnyRowData>) => any;
    delete: (data: TableData<TableAnyRowData>) => any;
    export: (data: TableData<TableAnyRowData>) => any;
    "selection-change": (data: TableData<TableAnyRowData>) => any;
    "pagination-change": (data: TablePagination) => any;
    "header-change": (data: TableColumn<any>, sort: SortData, filter: FilterConditionData[]) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onEdit?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    onDelete?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    onExport?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    "onSelection-change"?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    "onPagination-change"?: ((data: TablePagination) => any) | undefined;
    "onHeader-change"?: ((data: TableColumn<any>, sort: SortData, filter: FilterConditionData[]) => any) | undefined;
}>, {
    data: TableData;
    columns: TableColumn[];
    page: number;
    rowKey: string | ((row: any) => string);
    visibleButtons: BuiltInTableActionButtonName[];
    total: number;
    pageSize: number;
    paginationLayout: string;
    selectedColumnKeys: string[];
    paginationPosition: TablePaginationPosition;
    border: boolean;
    stickyHeader: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
