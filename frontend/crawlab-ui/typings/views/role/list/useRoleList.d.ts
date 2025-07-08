declare const useRoleList: () => {
    selectableFunction: (row: Role) => boolean;
    navActions?: import("vue").Ref<ListActionGroup[]>;
    tableLoading: import("vue").Ref<boolean>;
    tableColumns?: import("vue").Ref<TableColumns<Role>, TableColumns<Role>> | undefined;
    tableData: import("vue").Ref<TableData<Role>, TableData<Role>>;
    tableTotal: import("vue").Ref<number>;
    tablePagination: import("vue").Ref<TablePagination>;
    tableListFilter: import("vue").Ref<FilterConditionData[]>;
    tableListSort: import("vue").Ref<SortData[]>;
    actionFunctions: ListLayoutActionFunctions;
    activeDialogKey: import("vue").ComputedRef<DialogKey | undefined>;
};
export default useRoleList;
