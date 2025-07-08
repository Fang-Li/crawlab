type __VLS_Props = {
    ns: ListStoreNamespace;
    content: string;
    navItems: FileNavItem[];
    defaultTabs?: FileNavItem[];
    activeNavItem?: FileNavItem;
    defaultExpandedKeys: string[];
    navMenuLoading?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    updateTabs: (item?: FileNavItem) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
