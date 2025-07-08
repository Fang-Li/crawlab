declare const useNodeList: () => {
    selectableFunction: TableSelectableFunction<CNode>;
    navActions?: import("vue").Ref<ListActionGroup[]>;
    tableLoading: import("vue").Ref<boolean>;
    tableColumns?: import("vue").Ref<TableColumns<CNode>, TableColumns<CNode>> | undefined;
    tableData: import("vue").Ref<TableData<CNode>, TableData<CNode>>;
    tableTotal: import("vue").Ref<number>;
    tablePagination: import("vue").Ref<TablePagination>;
    tableListFilter: import("vue").Ref<FilterConditionData[]>;
    tableListSort: import("vue").Ref<SortData[]>;
    actionFunctions: ListLayoutActionFunctions;
    activeDialogKey: import("vue").ComputedRef<DialogKey | undefined>;
};
export default useNodeList;
