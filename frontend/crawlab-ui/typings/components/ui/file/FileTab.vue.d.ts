type __VLS_Props = {
    ns: ListStoreNamespace;
    activeId: string;
    content: string;
    navItems: FileNavItem[];
    activeNavItem?: FileNavItem;
    services: FileServices<BaseModel>;
    defaultFilePaths: string[];
    navMenuLoading?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "create-spider": (item: FileNavItem) => any;
    "delete-spider": (item: FileNavItem) => any;
    "file-change": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onCreate-spider"?: ((item: FileNavItem) => any) | undefined;
    "onDelete-spider"?: ((item: FileNavItem) => any) | undefined;
    "onFile-change"?: ((value: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
