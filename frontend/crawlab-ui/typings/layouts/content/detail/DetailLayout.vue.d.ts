type __VLS_Props = {
    storeNamespace: ListStoreNamespace;
    navItemNameKey?: string;
    showBackButton?: boolean;
    showSaveButton?: boolean;
    navItemLabelFn?: (item: NavItem) => string;
};
declare const activeId: import("vue").ComputedRef<string>, activeTabName: import("vue").ComputedRef<string>, navLoading: import("vue").Ref<boolean, boolean>, navItems: import("vue").ComputedRef<NavItem<BaseModel>[]>, onNavSelect: (id: string) => Promise<void>, onNavTabsSelect: (tabName: string) => Promise<void>, onBack: () => Promise<void>, onSave: () => Promise<void>;
declare const computedTabs: import("vue").ComputedRef<NavItem<any>[]>;
declare const getNavList: (query?: string) => Promise<void>;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_38: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    actions?: (props: typeof __VLS_38) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    activeId: typeof activeId;
    activeTabName: typeof activeTabName;
    navLoading: typeof navLoading;
    navItems: typeof navItems;
    onNavSelect: typeof onNavSelect;
    onNavTabsSelect: typeof onNavTabsSelect;
    onBack: typeof onBack;
    onSave: typeof onSave;
    computedTabs: typeof computedTabs;
    getNavList: typeof getNavList;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    navItemNameKey: string;
    showBackButton: boolean;
    showSaveButton: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    navItemNameKey: string;
    showBackButton: boolean;
    showSaveButton: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
