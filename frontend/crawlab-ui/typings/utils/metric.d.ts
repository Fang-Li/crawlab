export declare const formatBytes: (bytes?: number, decimal?: number) => string;
export declare const formatNumber: (value?: number, decimal?: number) => string;
export declare const formatDuration: (value?: number, decimal?: number) => string;
export declare const getAllMetricGroups: () => MetricGroup[];
export declare const getMetricUnitLabel: (metricName: string) => "" | "MB" | "GB" | "%" | "MB/s";
export declare const getMetricFormatValue: (metricGroup: MetricGroup, value: number) => string;
