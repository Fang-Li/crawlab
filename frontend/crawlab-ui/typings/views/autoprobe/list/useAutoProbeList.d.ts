declare const useAutoProbeList: () => {
    navActions: import("vue").ComputedRef<ListActionGroup[]>;
    tableColumns: import("vue").ComputedRef<TableColumns<AutoProbeV2>>;
    rowKey: (row: AutoProbeV2) => string;
    tableLoading: import("vue").Ref<boolean>;
    tableData: import("vue").Ref<TableData<AutoProbeV2>, TableData<AutoProbeV2>>;
    tableTotal: import("vue").Ref<number>;
    tablePagination: import("vue").Ref<TablePagination>;
    tableListFilter: import("vue").Ref<FilterConditionData[]>;
    tableListSort: import("vue").Ref<SortData[]>;
    actionFunctions: ListLayoutActionFunctions;
    activeDialogKey: import("vue").ComputedRef<DialogKey | undefined>;
};
export default useAutoProbeList;
