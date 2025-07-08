export declare const globalLayoutSettingsKey = "globalLayoutSettings";
export declare const getDefaultStoreState: <T = any>(ns: StoreNamespace) => BaseStoreState<T>;
export declare const getDefaultStoreGetters: <T = any>(opts?: GetDefaultStoreGettersOptions) => BaseStoreGetters<BaseStoreState<T>>;
export declare const getDefaultStoreMutations: <T = any>() => BaseStoreMutations<T>;
export declare const getDefaultStoreActions: <T = any>(endpoint: string) => BaseStoreActions;
