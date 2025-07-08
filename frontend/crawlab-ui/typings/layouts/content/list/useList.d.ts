import { Store } from 'vuex';
export declare const getFilterConditions: (column: TableColumn, filter: TableHeaderDialogFilterData) => FilterConditionData[];
declare const useList: <T extends BaseModel>(ns: ListStoreNamespace, store: Store<RootStoreState>, opts?: UseListOptions<T>) => ListLayoutComponentData<T>;
export default useList;
