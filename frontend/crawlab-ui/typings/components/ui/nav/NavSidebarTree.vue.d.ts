type __VLS_Props = {
    activeKey: string;
    items: NavItem[];
    showCheckbox: boolean;
    defaultCheckedKeys: string[];
    defaultExpandedKeys: string[];
    defaultExpandAll: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    select: (item: NavItem<any>) => any;
    check: (item: NavItem<any>, checked: boolean, checkedNodes: NavItem<any>[]) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((item: NavItem<any>) => any) | undefined;
    onCheck?: ((item: NavItem<any>, checked: boolean, checkedNodes: NavItem<any>[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
