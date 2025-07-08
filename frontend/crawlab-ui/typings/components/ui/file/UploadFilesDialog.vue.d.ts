type __VLS_Props = {
    ns: ListStoreNamespace;
    activeDialogKey?: DialogKey;
    activeId: string;
    form: BaseModel;
    services: FileServices<BaseModel>;
    fileNavItems: FileNavItem[];
    defaultTargetDirectory?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
