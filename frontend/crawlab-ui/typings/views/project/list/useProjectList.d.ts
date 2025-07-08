declare const useProjectList: () => {
    selectableFunction: (row: Project) => boolean;
    navActions?: import("vue").Ref<ListActionGroup[]>;
    tableLoading: import("vue").Ref<boolean>;
    tableColumns?: import("vue").Ref<TableColumns<Project>, TableColumns<Project>> | undefined;
    tableData: import("vue").Ref<TableData<Project>, TableData<Project>>;
    tableTotal: import("vue").Ref<number>;
    tablePagination: import("vue").Ref<TablePagination>;
    tableListFilter: import("vue").Ref<FilterConditionData[]>;
    tableListSort: import("vue").Ref<SortData[]>;
    actionFunctions: ListLayoutActionFunctions;
    activeDialogKey: import("vue").ComputedRef<DialogKey | undefined>;
};
export default useProjectList;
