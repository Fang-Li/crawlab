type __VLS_Props = {
    title: string;
    checked?: string[];
    data?: DraggableItemData[];
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    drag: (items: DraggableItemData[]) => any;
    check: (value: string[]) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onDrag?: ((items: DraggableItemData[]) => any) | undefined;
    onCheck?: ((value: string[]) => any) | undefined;
}>, {
    title: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
