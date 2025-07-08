type __VLS_Props = {
    type?: NavSidebarType;
    collapsed?: boolean;
    showActions?: boolean;
    items?: NavItem[];
    activeKey?: string;
    showCheckbox?: boolean;
    defaultCheckedKeys?: string[];
    defaultExpandedKeys?: string[];
    defaultExpandAll?: boolean;
    noSearch?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    scroll: (id: string) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    select: (item: NavItem<any>) => any;
    check: (item: NavItem<any>, checked: boolean, items: NavItem<any>[]) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((item: NavItem<any>) => any) | undefined;
    onCheck?: ((item: NavItem<any>, checked: boolean, items: NavItem<any>[]) => any) | undefined;
}>, {
    type: NavSidebarType;
    defaultExpandedKeys: string[];
    activeKey: string;
    items: NavItem[];
    collapsed: boolean;
    defaultExpandAll: boolean;
    defaultCheckedKeys: string[];
    showCheckbox: boolean;
    showActions: boolean;
    noSearch: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
