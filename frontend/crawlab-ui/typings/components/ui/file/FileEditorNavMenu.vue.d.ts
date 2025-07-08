type __VLS_Props = {
    loading?: boolean;
    navMenuCollapsed?: boolean;
    activeItem?: FileNavItem;
    items: FileNavItem[];
    defaultExpandAll: boolean;
    defaultExpandedKeys: string[];
    styles?: FileEditorStyles;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
