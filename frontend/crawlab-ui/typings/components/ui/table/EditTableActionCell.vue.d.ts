import type { TooltipTriggerType } from 'element-plus/es/components/tooltip/src/trigger';
import type { Placement } from '@popperjs/core';
type __VLS_Props = {
    trigger?: TooltipTriggerType;
    placement?: Placement;
    deleted?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    delete: () => any;
    revert: () => any;
    "add-before": () => any;
    "add-after": () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onDelete?: (() => any) | undefined;
    onRevert?: (() => any) | undefined;
    "onAdd-before"?: (() => any) | undefined;
    "onAdd-after"?: (() => any) | undefined;
}>, {
    trigger: TooltipTriggerType;
    placement: Placement;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
