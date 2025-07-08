import { TASK_MODE_RANDOM, TASK_MODE_SELECTED_NODES } from '@/constants/task';
import { EMPTY_OBJECT_ID } from '@/utils/mongo';
import { priorityOptions } from '@/utils';
import ClRemoteSelect from '@/components/ui/select/RemoteSelect.vue';
declare const t: (path: string, number?: number | null, args?: Record<string, any>) => string;
declare const allNodes: import("vue").ComputedRef<CNode[]>;
declare const toRunNodes: import("vue").ComputedRef<CNode[]>;
declare const form: import("vue").ComputedRef<Spider>, formRef: import("vue").Ref<any, any>, isFormItemDisabled: (prop: string) => boolean, modeOptions: SelectOption<any>[];
declare const isDetail: import("vue").ComputedRef<boolean>;
declare const onDataCollectionSuggestionSelect: ({ _id, }: {
    _id: string;
    value: string;
}) => void;
declare const onDataCollectionInput: (value: string) => void;
declare const spiderTemplateGroupOptions: import("vue").ComputedRef<SelectOption<any>[]>;
declare const onTemplateChange: (value: string) => void;
declare const activeTemplateOption: import("vue").ComputedRef<SpiderTemplate | undefined>;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_7: {}, __VLS_145: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    header?: (props: typeof __VLS_7) => any;
} & {
    footer?: (props: typeof __VLS_145) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<{}, {
    TASK_MODE_RANDOM: typeof TASK_MODE_RANDOM;
    TASK_MODE_SELECTED_NODES: typeof TASK_MODE_SELECTED_NODES;
    EMPTY_OBJECT_ID: typeof EMPTY_OBJECT_ID;
    priorityOptions: typeof priorityOptions;
    ClRemoteSelect: typeof ClRemoteSelect;
    t: typeof t;
    allNodes: typeof allNodes;
    toRunNodes: typeof toRunNodes;
    form: typeof form;
    formRef: typeof formRef;
    isFormItemDisabled: typeof isFormItemDisabled;
    modeOptions: typeof modeOptions;
    isDetail: typeof isDetail;
    onDataCollectionSuggestionSelect: typeof onDataCollectionSuggestionSelect;
    onDataCollectionInput: typeof onDataCollectionInput;
    spiderTemplateGroupOptions: typeof spiderTemplateGroupOptions;
    onTemplateChange: typeof onTemplateChange;
    activeTemplateOption: typeof activeTemplateOption;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<{}, {
    validate: () => Promise<void>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
