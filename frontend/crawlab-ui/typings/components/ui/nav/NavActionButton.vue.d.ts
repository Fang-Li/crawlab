import type { ButtonType, ButtonProps } from '@/components/ui/button/types';
type __VLS_Props = ButtonProps & {
    buttonType: ButtonType;
    label?: string;
    icon?: Icon;
    onClick?: () => void;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
