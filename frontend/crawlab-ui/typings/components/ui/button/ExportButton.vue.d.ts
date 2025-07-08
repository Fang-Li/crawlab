import type { FaIconButtonProps } from './types';
type __VLS_Props = {
    target: string | (() => string);
    conditions?: FilterConditionData[] | (() => FilterConditionData[]);
    dbId?: string;
    buttonType?: 'fa-icon' | 'label';
    icon?: Icon;
    label?: string;
    tooltip?: string;
} & Omit<FaIconButtonProps, 'icon'>;
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    error: (error: Error) => any;
    success: () => any;
    click: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onError?: ((error: Error) => any) | undefined;
    onSuccess?: (() => any) | undefined;
    onClick?: (() => any) | undefined;
}>, {
    icon: Icon;
    buttonType: "fa-icon" | "label";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
