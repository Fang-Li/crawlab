declare const useNotificationSettingList: () => {
    navActions?: import("vue").Ref<ListActionGroup[]>;
    tableLoading: import("vue").Ref<boolean>;
    tableColumns?: import("vue").Ref<TableColumns<NotificationSetting>, TableColumns<NotificationSetting>> | undefined;
    tableData: import("vue").Ref<TableData<NotificationSetting>, TableData<NotificationSetting>>;
    tableTotal: import("vue").Ref<number>;
    tablePagination: import("vue").Ref<TablePagination>;
    tableListFilter: import("vue").Ref<FilterConditionData[]>;
    tableListSort: import("vue").Ref<SortData[]>;
    actionFunctions: ListLayoutActionFunctions;
    activeDialogKey: import("vue").ComputedRef<DialogKey | undefined>;
};
export default useNotificationSettingList;
