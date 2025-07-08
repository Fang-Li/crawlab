import type { ButtonType } from '@/components/ui/button/types';
export interface NavActionBackProps {
    buttonType?: ButtonType;
    label?: string;
    tooltip?: string;
    icon?: Icon;
    type?: BasicType;
    size?: BasicSize;
    disabled?: boolean;
}
declare const _default: import("vue").DefineComponent<NavActionBackProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: () => any;
}, string, import("vue").PublicProps, Readonly<NavActionBackProps> & Readonly<{
    onClick?: (() => any) | undefined;
}>, {
    label: string;
    disabled: boolean;
    type: BasicType;
    icon: Icon;
    size: BasicSize;
    buttonType: ButtonType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
