declare const useDatabaseList: () => {
    selectableFunction: TableSelectableFunction<Database>;
    navActions?: import("vue").Ref<ListActionGroup[]>;
    tableLoading: import("vue").Ref<boolean>;
    tableColumns?: import("vue").Ref<TableColumns<Database>, TableColumns<Database>> | undefined;
    tableData: import("vue").Ref<TableData<Database>, TableData<Database>>;
    tableTotal: import("vue").Ref<number>;
    tablePagination: import("vue").Ref<TablePagination>;
    tableListFilter: import("vue").Ref<FilterConditionData[]>;
    tableListSort: import("vue").Ref<SortData[]>;
    actionFunctions: ListLayoutActionFunctions;
    activeDialogKey: import("vue").ComputedRef<DialogKey | undefined>;
};
export default useDatabaseList;
