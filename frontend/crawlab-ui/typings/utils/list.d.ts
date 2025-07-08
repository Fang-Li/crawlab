import { Ref } from 'vue';
import { Store } from 'vuex';
export declare const getDefaultUseListOptions: <T extends BaseModel>(navActions: Ref<ListActionGroup[]>, tableColumns: Ref<TableColumns<T>>) => UseListOptions<T>;
export declare const setupListComponent: (ns: ListStoreNamespace, store: Store<RootStoreState>, autoUpdate?: boolean) => void;
export declare const prependAllToSelectOptions: (options: SelectOption[]) => SelectOption[];
export declare const onListFilterChangeByKey: (store: Store<RootStoreState>, ns: ListStoreNamespace, key: string, op?: string, options?: {
    update: boolean;
}) => (value: string) => Promise<void>;
