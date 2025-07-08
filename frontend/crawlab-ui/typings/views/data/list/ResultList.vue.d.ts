interface FilterConditionData {
    key?: string;
    op?: string;
    value?: any;
}
type __VLS_Props = {
    spiderId?: string;
    noActions?: boolean;
    embedded?: boolean;
    visibleButtons?: BuiltInTableActionButtonName[];
    filter?: FilterConditionData[] | (() => FilterConditionData[]);
    displayAllFields?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    visibleButtons: BuiltInTableActionButtonName[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
