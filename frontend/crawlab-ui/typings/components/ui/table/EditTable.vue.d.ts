import { ColumnCls } from 'element-plus/es/components/table/src/table/defaults';
import { CellCls, CellStyle, ColumnStyle } from 'element-plus';
import { ClTable } from '@/components';
type __VLS_Props = {
    data: TableData;
    columns: TableColumn[];
    selectedColumnKeys?: string[];
    total?: number;
    page?: number;
    pageSize?: number;
    rowKey?: string | ((row: any) => string);
    selectable?: boolean;
    visibleButtons?: BuiltInTableActionButtonName[];
    hideFooter?: boolean;
    selectableFunction?: TableSelectableFunction;
    paginationLayout?: string;
    loading?: boolean;
    paginationPosition?: TablePaginationPosition;
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
    addButtonLabel?: string;
    hideDefaultActions?: boolean;
};
type __VLS_Emit = {
    (e: 'add'): void;
    (e: 'pagination-change', data: TablePagination): void;
    (e: 'selection-change', data: TableData): void;
};
declare const emit: __VLS_Emit;
declare const t: (path: string, number?: number | null, args?: Record<string, any>) => string;
declare const tableRef: import("vue").Ref<({
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<{
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
    }> & Readonly<{
        onEdit?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        onDelete?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        onExport?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        "onSelection-change"?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        "onPagination-change"?: ((data: TablePagination) => any) | undefined;
        "onHeader-change"?: ((data: TableColumn<any>, sort: SortData, filter: FilterConditionData[]) => any) | undefined;
    }>, {
        clearSelection: () => void;
        checkAll: () => void;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
        edit: (data: TableData<TableAnyRowData>) => any;
        delete: (data: TableData<TableAnyRowData>) => any;
        export: (data: TableData<TableAnyRowData>) => any;
        "selection-change": (data: TableData<TableAnyRowData>) => any;
        "pagination-change": (data: TablePagination) => any;
        "header-change": (data: TableColumn<any>, sort: SortData, filter: FilterConditionData[]) => any;
    }, import("vue").PublicProps, {
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
    }, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
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
    }> & Readonly<{
        onEdit?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        onDelete?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        onExport?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        "onSelection-change"?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        "onPagination-change"?: ((data: TablePagination) => any) | undefined;
        "onHeader-change"?: ((data: TableColumn<any>, sort: SortData, filter: FilterConditionData[]) => any) | undefined;
    }>, {
        clearSelection: () => void;
        checkAll: () => void;
    }, {}, {}, {}, {
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
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<{
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
}> & Readonly<{
    onEdit?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    onDelete?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    onExport?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    "onSelection-change"?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    "onPagination-change"?: ((data: TablePagination) => any) | undefined;
    "onHeader-change"?: ((data: TableColumn<any>, sort: SortData, filter: FilterConditionData[]) => any) | undefined;
}>, {
    clearSelection: () => void;
    checkAll: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    edit: (data: TableData<TableAnyRowData>) => any;
    delete: (data: TableData<TableAnyRowData>) => any;
    export: (data: TableData<TableAnyRowData>) => any;
    "selection-change": (data: TableData<TableAnyRowData>) => any;
    "pagination-change": (data: TablePagination) => any;
    "header-change": (data: TableColumn<any>, sort: SortData, filter: FilterConditionData[]) => any;
}, string, {
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
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        empty?: void | undefined;
        'actions-prefix'?: void | undefined;
        'actions-suffix'?: void | undefined;
    };
})) | null, ({
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<{
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
    }> & Readonly<{
        onEdit?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        onDelete?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        onExport?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        "onSelection-change"?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        "onPagination-change"?: ((data: TablePagination) => any) | undefined;
        "onHeader-change"?: ((data: TableColumn<any>, sort: SortData, filter: FilterConditionData[]) => any) | undefined;
    }>, {
        clearSelection: () => void;
        checkAll: () => void;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
        edit: (data: TableData<TableAnyRowData>) => any;
        delete: (data: TableData<TableAnyRowData>) => any;
        export: (data: TableData<TableAnyRowData>) => any;
        "selection-change": (data: TableData<TableAnyRowData>) => any;
        "pagination-change": (data: TablePagination) => any;
        "header-change": (data: TableColumn<any>, sort: SortData, filter: FilterConditionData[]) => any;
    }, import("vue").PublicProps, {
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
    }, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
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
    }> & Readonly<{
        onEdit?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        onDelete?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        onExport?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        "onSelection-change"?: ((data: TableData<TableAnyRowData>) => any) | undefined;
        "onPagination-change"?: ((data: TablePagination) => any) | undefined;
        "onHeader-change"?: ((data: TableColumn<any>, sort: SortData, filter: FilterConditionData[]) => any) | undefined;
    }>, {
        clearSelection: () => void;
        checkAll: () => void;
    }, {}, {}, {}, {
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
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<{
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
}> & Readonly<{
    onEdit?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    onDelete?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    onExport?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    "onSelection-change"?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    "onPagination-change"?: ((data: TablePagination) => any) | undefined;
    "onHeader-change"?: ((data: TableColumn<any>, sort: SortData, filter: FilterConditionData[]) => any) | undefined;
}>, {
    clearSelection: () => void;
    checkAll: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    edit: (data: TableData<TableAnyRowData>) => any;
    delete: (data: TableData<TableAnyRowData>) => any;
    export: (data: TableData<TableAnyRowData>) => any;
    "selection-change": (data: TableData<TableAnyRowData>) => any;
    "pagination-change": (data: TablePagination) => any;
    "header-change": (data: TableColumn<any>, sort: SortData, filter: FilterConditionData[]) => any;
}, string, {
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
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        empty?: void | undefined;
        'actions-prefix'?: void | undefined;
        'actions-suffix'?: void | undefined;
    };
})) | null>;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_20: {}, __VLS_22: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    'actions-prefix'?: (props: typeof __VLS_20) => any;
} & {
    'actions-suffix'?: (props: typeof __VLS_22) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    ClTable: typeof ClTable;
    emit: typeof emit;
    t: typeof t;
    tableRef: typeof tableRef;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    add: () => any;
    "selection-change": (data: TableData<TableAnyRowData>) => any;
    "pagination-change": (data: TablePagination) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onAdd?: (() => any) | undefined;
    "onSelection-change"?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    "onPagination-change"?: ((data: TablePagination) => any) | undefined;
}>, {
    border: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {
    clearSelection: () => any;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    add: () => any;
    "selection-change": (data: TableData<TableAnyRowData>) => any;
    "pagination-change": (data: TablePagination) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onAdd?: (() => any) | undefined;
    "onSelection-change"?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    "onPagination-change"?: ((data: TablePagination) => any) | undefined;
}>, {
    border: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
