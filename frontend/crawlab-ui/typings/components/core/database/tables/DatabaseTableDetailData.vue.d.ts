type __VLS_Props = {
    loading?: boolean;
    activeTable?: DatabaseTable;
    activeId?: string;
    databaseName?: string;
    filter?: {
        [key: string]: any;
    };
    displayAllFields?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    rollback: () => void;
    commit: () => Promise<void>;
    hasChanges: import("vue").ComputedRef<boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
