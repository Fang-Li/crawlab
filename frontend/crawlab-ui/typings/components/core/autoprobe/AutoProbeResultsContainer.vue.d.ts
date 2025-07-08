type __VLS_Props = {
    data?: PageData | PageData[];
    fields?: AutoProbeNavItem[];
    activeFieldName?: string;
    activeNavItem?: AutoProbeNavItem;
    url?: string;
    viewport?: PageViewPort;
    activeId?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "size-change": (size: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onSize-change"?: ((size: number) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
