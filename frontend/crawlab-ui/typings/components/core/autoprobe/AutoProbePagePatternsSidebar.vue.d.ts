type __VLS_Props = {
    activeNavItemId?: string;
    treeItems?: AutoProbeNavItem[];
    defaultExpandedKeys?: string[];
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    getNode: (id: string) => AutoProbeNavItem | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "node-select": (item: AutoProbeNavItem<any>) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onNode-select"?: ((item: AutoProbeNavItem<any>) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
