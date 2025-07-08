import { Close } from '@element-plus/icons-vue';
type __VLS_Props = {
    activeTab?: FileNavItem;
    tabs?: FileNavItem[];
    styles?: FileEditorStyles;
};
declare const navTabs: import("vue").Ref<HTMLDivElement | undefined, HTMLDivElement | undefined>;
declare const contextMenuClicking: import("vue").Ref<boolean, boolean>;
declare const tabs: import("vue").ComputedRef<FileNavItem[]>;
declare const getTitle: (item: FileNavItem) => string | undefined;
declare const onClick: (item: FileNavItem) => void;
declare const onClose: (item: FileNavItem) => void;
declare const onCloseOthers: (item: FileNavItem) => void;
declare const onCloseAll: () => void;
declare const onDragEnd: (items: FileNavItem[]) => void;
declare const onContextMenuShow: (item: FileNavItem) => void;
declare const onContextMenuHide: () => void;
declare const isShowContextMenu: (item: FileNavItem) => boolean;
declare const isActive: (item: FileNavItem) => boolean | undefined;
declare const getItemStyle: (item: FileNavItem) => {
    backgroundColor: string | undefined;
    color: string | undefined;
};
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_1: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    prefix?: (props: typeof __VLS_1) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    Close: typeof Close;
    navTabs: typeof navTabs;
    contextMenuClicking: typeof contextMenuClicking;
    tabs: typeof tabs;
    getTitle: typeof getTitle;
    onClick: typeof onClick;
    onClose: typeof onClose;
    onCloseOthers: typeof onCloseOthers;
    onCloseAll: typeof onCloseAll;
    onDragEnd: typeof onDragEnd;
    onContextMenuShow: typeof onContextMenuShow;
    onContextMenuHide: typeof onContextMenuHide;
    isShowContextMenu: typeof isShowContextMenu;
    isActive: typeof isActive;
    getItemStyle: typeof getItemStyle;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "tab-click": (item: FileNavItem) => any;
    "tab-close": (item: FileNavItem) => any;
    "tab-close-others": (item: FileNavItem) => any;
    "tab-close-all": () => any;
    "tab-dragend": (items: FileNavItem[]) => any;
    "show-more": () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onTab-click"?: ((item: FileNavItem) => any) | undefined;
    "onTab-close"?: ((item: FileNavItem) => any) | undefined;
    "onTab-close-others"?: ((item: FileNavItem) => any) | undefined;
    "onTab-close-all"?: (() => any) | undefined;
    "onTab-dragend"?: ((items: FileNavItem[]) => any) | undefined;
    "onShow-more"?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "tab-click": (item: FileNavItem) => any;
    "tab-close": (item: FileNavItem) => any;
    "tab-close-others": (item: FileNavItem) => any;
    "tab-close-all": () => any;
    "tab-dragend": (items: FileNavItem[]) => any;
    "show-more": () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onTab-click"?: ((item: FileNavItem) => any) | undefined;
    "onTab-close"?: ((item: FileNavItem) => any) | undefined;
    "onTab-close-others"?: ((item: FileNavItem) => any) | undefined;
    "onTab-close-all"?: (() => any) | undefined;
    "onTab-dragend"?: ((items: FileNavItem[]) => any) | undefined;
    "onShow-more"?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
