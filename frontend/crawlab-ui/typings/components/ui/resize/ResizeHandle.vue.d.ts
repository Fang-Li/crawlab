type __VLS_Props = {
    targetRef: HTMLElement;
    sizeKey?: string;
    direction?: 'horizontal' | 'vertical';
    position?: 'start' | 'end';
    width?: number;
    minSize?: number;
    maxSize?: number;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "size-change": (size: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onSize-change"?: ((size: number) => any) | undefined;
}>, {
    direction: "horizontal" | "vertical";
    minSize: number;
    position: "start" | "end";
    width: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
