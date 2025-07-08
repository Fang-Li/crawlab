import { Ref } from 'vue';
type __VLS_Props = {
    form: any;
    formRules?: FormRuleItem[];
    prop: string;
    fieldType: FormFieldType;
    options?: SelectOption[];
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (value: any) => void;
    onRegister?: (formRef: Ref) => void;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    placeholder: string;
    onChange: (value: any) => void;
    onRegister: (formRef: Ref) => void;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
