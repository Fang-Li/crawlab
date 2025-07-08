type __VLS_Props = {
    metric?: BasicMetric;
    size?: BasicSize;
    clickable?: boolean;
    metrics?: ('cpu_usage_percent' | 'used_memory_percent' | 'used_disk_percent' | 'used_memory' | 'used_disk')[];
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: MouseEvent) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
}>, {
    metrics: ("cpu_usage_percent" | "used_memory_percent" | "used_disk_percent" | "used_memory" | "used_disk")[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
