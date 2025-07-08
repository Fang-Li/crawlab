import { ChartData, ChartOptions, ChartTypeRegistry } from 'chart.js';
type __VLS_Props = {
    type: keyof ChartTypeRegistry;
    data?: ChartData;
    options?: ChartOptions;
    height?: string | number;
    width?: string | number;
    minHeight?: string | number;
    minWidth?: string | number;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    type: keyof ChartTypeRegistry;
    height: string | number;
    width: string | number;
    minWidth: string | number;
    minHeight: string | number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
