type __VLS_Props = {
    ns: ListStoreNamespace;
    apiPrefix: string;
    defaultMetricGroups?: string[];
    defaultTimeRange?: string;
    allMetricGroupsFn?: () => MetricGroup[];
    availableMetricGroups?: string[];
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "time-range-change": (timeRange: string) => any;
    "metric-groups-change": (metricGroups: string[]) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onTime-range-change"?: ((timeRange: string) => any) | undefined;
    "onMetric-groups-change"?: ((metricGroups: string[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
