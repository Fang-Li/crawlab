import { ElInput, ElAutocomplete, type AutocompleteFetchSuggestions } from 'element-plus';
import JsonEditorVue from 'json-editor-vue';
import { ClIcon } from '@/components';
type __VLS_Props = {
    modelValue?: any;
    isEdit?: boolean;
    required?: boolean;
    autocomplete?: boolean;
    select?: boolean;
    options?: SelectOption[];
    fetchSuggestions?: AutocompleteFetchSuggestions;
    triggerOnFocus?: boolean;
    autoFocus?: boolean;
    automaticDropdown?: boolean;
    dataType?: DatabaseDataType;
    readonly?: boolean;
};
declare const t: (path: string, number?: number | null, args?: Record<string, any>) => string;
declare const inputRef: import("vue").Ref<import("element-plus/es/utils").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly ariaLabel: StringConstructor;
        readonly id: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, undefined, boolean>;
        readonly size: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<StringConstructor, "" | "small" | "default" | "large", never>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly disabled: BooleanConstructor;
        readonly modelValue: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string | number) | (() => string | number | null | undefined) | ((new (...args: any[]) => string | number) | (() => string | number | null | undefined))[], unknown, unknown, "", boolean>;
        readonly maxlength: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly minlength: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly type: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "text", boolean>;
        readonly resize: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<StringConstructor, "none" | "both" | "horizontal" | "vertical", unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly autosize: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => boolean | {
            minRows?: number;
            maxRows?: number;
        }) | (() => import("element-plus").InputAutoSize) | ((new (...args: any[]) => boolean | {
            minRows?: number;
            maxRows?: number;
        }) | (() => import("element-plus").InputAutoSize))[], unknown, unknown, false, boolean>;
        readonly autocomplete: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "off", boolean>;
        readonly formatter: {
            readonly type: import("vue").PropType<Function>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly parser: {
            readonly type: import("vue").PropType<Function>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly placeholder: {
            readonly type: import("vue").PropType<string>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly form: {
            readonly type: import("vue").PropType<string>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly readonly: BooleanConstructor;
        readonly clearable: BooleanConstructor;
        readonly showPassword: BooleanConstructor;
        readonly showWordLimit: BooleanConstructor;
        readonly suffixIcon: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component) | ((new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component))[], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly prefixIcon: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component) | ((new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component))[], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly containerRole: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, undefined, boolean>;
        readonly tabindex: import("element-plus/es/utils").EpPropFinalized<readonly [StringConstructor, NumberConstructor], unknown, unknown, 0, boolean>;
        readonly validateEvent: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
        readonly inputStyle: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue) | ((new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue))[], unknown, unknown, () => import("element-plus/es/utils").Mutable<{}>, boolean>;
        readonly autofocus: BooleanConstructor;
        readonly rows: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 2, boolean>;
    }>> & {
        "onUpdate:modelValue"?: ((value: string) => any) | undefined;
        onChange?: ((value: string) => any) | undefined;
        onCompositionend?: ((evt: CompositionEvent) => any) | undefined;
        onCompositionstart?: ((evt: CompositionEvent) => any) | undefined;
        onCompositionupdate?: ((evt: CompositionEvent) => any) | undefined;
        onFocus?: ((evt: FocusEvent) => any) | undefined;
        onBlur?: ((evt: FocusEvent) => any) | undefined;
        onInput?: ((value: string) => any) | undefined;
        onKeydown?: ((evt: Event | KeyboardEvent) => any) | undefined;
        onMouseenter?: ((evt: MouseEvent) => any) | undefined;
        onMouseleave?: ((evt: MouseEvent) => any) | undefined;
        onClear?: (() => any) | undefined;
    }, {
        input: import("vue").ShallowRef<HTMLInputElement | undefined>;
        textarea: import("vue").ShallowRef<HTMLTextAreaElement | undefined>;
        ref: import("vue").ComputedRef<HTMLInputElement | HTMLTextAreaElement | undefined>;
        textareaStyle: import("vue").ComputedRef<import("vue").StyleValue>;
        autosize: import("vue").Ref<import("element-plus").InputAutoSize>;
        isComposing: import("vue").Ref<boolean>;
        focus: () => void | undefined;
        blur: () => void | undefined;
        select: () => void;
        clear: () => void;
        resizeTextarea: () => void;
    }, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        input: (value: string) => void;
        clear: () => void;
        "update:modelValue": (value: string) => void;
        change: (value: string) => void;
        blur: (evt: FocusEvent) => void;
        compositionend: (evt: CompositionEvent) => void;
        compositionstart: (evt: CompositionEvent) => void;
        compositionupdate: (evt: CompositionEvent) => void;
        focus: (evt: FocusEvent) => void;
        keydown: (evt: Event | KeyboardEvent) => void;
        mouseenter: (evt: MouseEvent) => void;
        mouseleave: (evt: MouseEvent) => void;
    }, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, {
        readonly disabled: boolean;
        readonly id: string;
        readonly type: string;
        readonly modelValue: import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | number) | (() => string | number | null | undefined) | ((new (...args: any[]) => string | number) | (() => string | number | null | undefined))[], unknown, unknown>;
        readonly tabindex: import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>;
        readonly readonly: boolean;
        readonly autosize: import("element-plus").InputAutoSize;
        readonly autocomplete: string;
        readonly containerRole: string;
        readonly validateEvent: import("element-plus/es/utils").EpPropMergeType<BooleanConstructor, unknown, unknown>;
        readonly inputStyle: import("vue").StyleValue;
        readonly rows: number;
        readonly clearable: boolean;
        readonly showPassword: boolean;
        readonly showWordLimit: boolean;
        readonly autofocus: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly ariaLabel: StringConstructor;
        readonly id: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, undefined, boolean>;
        readonly size: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<StringConstructor, "" | "small" | "default" | "large", never>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly disabled: BooleanConstructor;
        readonly modelValue: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string | number) | (() => string | number | null | undefined) | ((new (...args: any[]) => string | number) | (() => string | number | null | undefined))[], unknown, unknown, "", boolean>;
        readonly maxlength: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly minlength: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly type: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "text", boolean>;
        readonly resize: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<StringConstructor, "none" | "both" | "horizontal" | "vertical", unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly autosize: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => boolean | {
            minRows?: number;
            maxRows?: number;
        }) | (() => import("element-plus").InputAutoSize) | ((new (...args: any[]) => boolean | {
            minRows?: number;
            maxRows?: number;
        }) | (() => import("element-plus").InputAutoSize))[], unknown, unknown, false, boolean>;
        readonly autocomplete: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "off", boolean>;
        readonly formatter: {
            readonly type: import("vue").PropType<Function>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly parser: {
            readonly type: import("vue").PropType<Function>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly placeholder: {
            readonly type: import("vue").PropType<string>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly form: {
            readonly type: import("vue").PropType<string>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly readonly: BooleanConstructor;
        readonly clearable: BooleanConstructor;
        readonly showPassword: BooleanConstructor;
        readonly showWordLimit: BooleanConstructor;
        readonly suffixIcon: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component) | ((new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component))[], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly prefixIcon: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component) | ((new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component))[], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly containerRole: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, undefined, boolean>;
        readonly tabindex: import("element-plus/es/utils").EpPropFinalized<readonly [StringConstructor, NumberConstructor], unknown, unknown, 0, boolean>;
        readonly validateEvent: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
        readonly inputStyle: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue) | ((new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue))[], unknown, unknown, () => import("element-plus/es/utils").Mutable<{}>, boolean>;
        readonly autofocus: BooleanConstructor;
        readonly rows: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 2, boolean>;
    }>> & {
        "onUpdate:modelValue"?: ((value: string) => any) | undefined;
        onChange?: ((value: string) => any) | undefined;
        onCompositionend?: ((evt: CompositionEvent) => any) | undefined;
        onCompositionstart?: ((evt: CompositionEvent) => any) | undefined;
        onCompositionupdate?: ((evt: CompositionEvent) => any) | undefined;
        onFocus?: ((evt: FocusEvent) => any) | undefined;
        onBlur?: ((evt: FocusEvent) => any) | undefined;
        onInput?: ((value: string) => any) | undefined;
        onKeydown?: ((evt: Event | KeyboardEvent) => any) | undefined;
        onMouseenter?: ((evt: MouseEvent) => any) | undefined;
        onMouseleave?: ((evt: MouseEvent) => any) | undefined;
        onClear?: (() => any) | undefined;
    }, {
        input: import("vue").ShallowRef<HTMLInputElement | undefined>;
        textarea: import("vue").ShallowRef<HTMLTextAreaElement | undefined>;
        ref: import("vue").ComputedRef<HTMLInputElement | HTMLTextAreaElement | undefined>;
        textareaStyle: import("vue").ComputedRef<import("vue").StyleValue>;
        autosize: import("vue").Ref<import("element-plus").InputAutoSize>;
        isComposing: import("vue").Ref<boolean>;
        focus: () => void | undefined;
        blur: () => void | undefined;
        select: () => void;
        clear: () => void;
        resizeTextarea: () => void;
    }, {}, {}, {}, {
        readonly disabled: boolean;
        readonly id: string;
        readonly type: string;
        readonly modelValue: import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | number) | (() => string | number | null | undefined) | ((new (...args: any[]) => string | number) | (() => string | number | null | undefined))[], unknown, unknown>;
        readonly tabindex: import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>;
        readonly readonly: boolean;
        readonly autosize: import("element-plus").InputAutoSize;
        readonly autocomplete: string;
        readonly containerRole: string;
        readonly validateEvent: import("element-plus/es/utils").EpPropMergeType<BooleanConstructor, unknown, unknown>;
        readonly inputStyle: import("vue").StyleValue;
        readonly rows: number;
        readonly clearable: boolean;
        readonly showPassword: boolean;
        readonly showWordLimit: boolean;
        readonly autofocus: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly ariaLabel: StringConstructor;
    readonly id: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, undefined, boolean>;
    readonly size: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<StringConstructor, "" | "small" | "default" | "large", never>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly disabled: BooleanConstructor;
    readonly modelValue: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string | number) | (() => string | number | null | undefined) | ((new (...args: any[]) => string | number) | (() => string | number | null | undefined))[], unknown, unknown, "", boolean>;
    readonly maxlength: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly minlength: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly type: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "text", boolean>;
    readonly resize: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<StringConstructor, "none" | "both" | "horizontal" | "vertical", unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly autosize: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => boolean | {
        minRows?: number;
        maxRows?: number;
    }) | (() => import("element-plus").InputAutoSize) | ((new (...args: any[]) => boolean | {
        minRows?: number;
        maxRows?: number;
    }) | (() => import("element-plus").InputAutoSize))[], unknown, unknown, false, boolean>;
    readonly autocomplete: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "off", boolean>;
    readonly formatter: {
        readonly type: import("vue").PropType<Function>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly parser: {
        readonly type: import("vue").PropType<Function>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly placeholder: {
        readonly type: import("vue").PropType<string>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly form: {
        readonly type: import("vue").PropType<string>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly readonly: BooleanConstructor;
    readonly clearable: BooleanConstructor;
    readonly showPassword: BooleanConstructor;
    readonly showWordLimit: BooleanConstructor;
    readonly suffixIcon: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component) | ((new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly prefixIcon: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component) | ((new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly containerRole: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, undefined, boolean>;
    readonly tabindex: import("element-plus/es/utils").EpPropFinalized<readonly [StringConstructor, NumberConstructor], unknown, unknown, 0, boolean>;
    readonly validateEvent: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
    readonly inputStyle: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue) | ((new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue))[], unknown, unknown, () => import("element-plus/es/utils").Mutable<{}>, boolean>;
    readonly autofocus: BooleanConstructor;
    readonly rows: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 2, boolean>;
}>> & {
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onChange?: ((value: string) => any) | undefined;
    onCompositionend?: ((evt: CompositionEvent) => any) | undefined;
    onCompositionstart?: ((evt: CompositionEvent) => any) | undefined;
    onCompositionupdate?: ((evt: CompositionEvent) => any) | undefined;
    onFocus?: ((evt: FocusEvent) => any) | undefined;
    onBlur?: ((evt: FocusEvent) => any) | undefined;
    onInput?: ((value: string) => any) | undefined;
    onKeydown?: ((evt: Event | KeyboardEvent) => any) | undefined;
    onMouseenter?: ((evt: MouseEvent) => any) | undefined;
    onMouseleave?: ((evt: MouseEvent) => any) | undefined;
    onClear?: (() => any) | undefined;
}, {
    input: import("vue").ShallowRef<HTMLInputElement | undefined>;
    textarea: import("vue").ShallowRef<HTMLTextAreaElement | undefined>;
    ref: import("vue").ComputedRef<HTMLInputElement | HTMLTextAreaElement | undefined>;
    textareaStyle: import("vue").ComputedRef<import("vue").StyleValue>;
    autosize: import("vue").Ref<import("element-plus").InputAutoSize>;
    isComposing: import("vue").Ref<boolean>;
    focus: () => void | undefined;
    blur: () => void | undefined;
    select: () => void;
    clear: () => void;
    resizeTextarea: () => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    input: (value: string) => void;
    clear: () => void;
    "update:modelValue": (value: string) => void;
    change: (value: string) => void;
    blur: (evt: FocusEvent) => void;
    compositionend: (evt: CompositionEvent) => void;
    compositionstart: (evt: CompositionEvent) => void;
    compositionupdate: (evt: CompositionEvent) => void;
    focus: (evt: FocusEvent) => void;
    keydown: (evt: Event | KeyboardEvent) => void;
    mouseenter: (evt: MouseEvent) => void;
    mouseleave: (evt: MouseEvent) => void;
}, string, {
    readonly disabled: boolean;
    readonly id: string;
    readonly type: string;
    readonly modelValue: import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | number) | (() => string | number | null | undefined) | ((new (...args: any[]) => string | number) | (() => string | number | null | undefined))[], unknown, unknown>;
    readonly tabindex: import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>;
    readonly readonly: boolean;
    readonly autosize: import("element-plus").InputAutoSize;
    readonly autocomplete: string;
    readonly containerRole: string;
    readonly validateEvent: import("element-plus/es/utils").EpPropMergeType<BooleanConstructor, unknown, unknown>;
    readonly inputStyle: import("vue").StyleValue;
    readonly rows: number;
    readonly clearable: boolean;
    readonly showPassword: boolean;
    readonly showWordLimit: boolean;
    readonly autofocus: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        prepend?(_: {}): any;
        prefix?(_: {}): any;
        suffix?(_: {}): any;
        append?(_: {}): any;
    };
})> | null, import("element-plus/es/utils").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly ariaLabel: StringConstructor;
        readonly id: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, undefined, boolean>;
        readonly size: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<StringConstructor, "" | "small" | "default" | "large", never>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly disabled: BooleanConstructor;
        readonly modelValue: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string | number) | (() => string | number | null | undefined) | ((new (...args: any[]) => string | number) | (() => string | number | null | undefined))[], unknown, unknown, "", boolean>;
        readonly maxlength: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly minlength: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly type: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "text", boolean>;
        readonly resize: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<StringConstructor, "none" | "both" | "horizontal" | "vertical", unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly autosize: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => boolean | {
            minRows?: number;
            maxRows?: number;
        }) | (() => import("element-plus").InputAutoSize) | ((new (...args: any[]) => boolean | {
            minRows?: number;
            maxRows?: number;
        }) | (() => import("element-plus").InputAutoSize))[], unknown, unknown, false, boolean>;
        readonly autocomplete: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "off", boolean>;
        readonly formatter: {
            readonly type: import("vue").PropType<Function>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly parser: {
            readonly type: import("vue").PropType<Function>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly placeholder: {
            readonly type: import("vue").PropType<string>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly form: {
            readonly type: import("vue").PropType<string>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly readonly: BooleanConstructor;
        readonly clearable: BooleanConstructor;
        readonly showPassword: BooleanConstructor;
        readonly showWordLimit: BooleanConstructor;
        readonly suffixIcon: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component) | ((new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component))[], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly prefixIcon: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component) | ((new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component))[], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly containerRole: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, undefined, boolean>;
        readonly tabindex: import("element-plus/es/utils").EpPropFinalized<readonly [StringConstructor, NumberConstructor], unknown, unknown, 0, boolean>;
        readonly validateEvent: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
        readonly inputStyle: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue) | ((new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue))[], unknown, unknown, () => import("element-plus/es/utils").Mutable<{}>, boolean>;
        readonly autofocus: BooleanConstructor;
        readonly rows: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 2, boolean>;
    }>> & {
        "onUpdate:modelValue"?: ((value: string) => any) | undefined;
        onChange?: ((value: string) => any) | undefined;
        onCompositionend?: ((evt: CompositionEvent) => any) | undefined;
        onCompositionstart?: ((evt: CompositionEvent) => any) | undefined;
        onCompositionupdate?: ((evt: CompositionEvent) => any) | undefined;
        onFocus?: ((evt: FocusEvent) => any) | undefined;
        onBlur?: ((evt: FocusEvent) => any) | undefined;
        onInput?: ((value: string) => any) | undefined;
        onKeydown?: ((evt: Event | KeyboardEvent) => any) | undefined;
        onMouseenter?: ((evt: MouseEvent) => any) | undefined;
        onMouseleave?: ((evt: MouseEvent) => any) | undefined;
        onClear?: (() => any) | undefined;
    }, {
        input: import("vue").ShallowRef<HTMLInputElement | undefined>;
        textarea: import("vue").ShallowRef<HTMLTextAreaElement | undefined>;
        ref: import("vue").ComputedRef<HTMLInputElement | HTMLTextAreaElement | undefined>;
        textareaStyle: import("vue").ComputedRef<import("vue").StyleValue>;
        autosize: import("vue").Ref<import("element-plus").InputAutoSize>;
        isComposing: import("vue").Ref<boolean>;
        focus: () => void | undefined;
        blur: () => void | undefined;
        select: () => void;
        clear: () => void;
        resizeTextarea: () => void;
    }, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        input: (value: string) => void;
        clear: () => void;
        "update:modelValue": (value: string) => void;
        change: (value: string) => void;
        blur: (evt: FocusEvent) => void;
        compositionend: (evt: CompositionEvent) => void;
        compositionstart: (evt: CompositionEvent) => void;
        compositionupdate: (evt: CompositionEvent) => void;
        focus: (evt: FocusEvent) => void;
        keydown: (evt: Event | KeyboardEvent) => void;
        mouseenter: (evt: MouseEvent) => void;
        mouseleave: (evt: MouseEvent) => void;
    }, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, {
        readonly disabled: boolean;
        readonly id: string;
        readonly type: string;
        readonly modelValue: import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | number) | (() => string | number | null | undefined) | ((new (...args: any[]) => string | number) | (() => string | number | null | undefined))[], unknown, unknown>;
        readonly tabindex: import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>;
        readonly readonly: boolean;
        readonly autosize: import("element-plus").InputAutoSize;
        readonly autocomplete: string;
        readonly containerRole: string;
        readonly validateEvent: import("element-plus/es/utils").EpPropMergeType<BooleanConstructor, unknown, unknown>;
        readonly inputStyle: import("vue").StyleValue;
        readonly rows: number;
        readonly clearable: boolean;
        readonly showPassword: boolean;
        readonly showWordLimit: boolean;
        readonly autofocus: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly ariaLabel: StringConstructor;
        readonly id: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, undefined, boolean>;
        readonly size: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<StringConstructor, "" | "small" | "default" | "large", never>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly disabled: BooleanConstructor;
        readonly modelValue: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string | number) | (() => string | number | null | undefined) | ((new (...args: any[]) => string | number) | (() => string | number | null | undefined))[], unknown, unknown, "", boolean>;
        readonly maxlength: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly minlength: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly type: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "text", boolean>;
        readonly resize: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<StringConstructor, "none" | "both" | "horizontal" | "vertical", unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly autosize: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => boolean | {
            minRows?: number;
            maxRows?: number;
        }) | (() => import("element-plus").InputAutoSize) | ((new (...args: any[]) => boolean | {
            minRows?: number;
            maxRows?: number;
        }) | (() => import("element-plus").InputAutoSize))[], unknown, unknown, false, boolean>;
        readonly autocomplete: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "off", boolean>;
        readonly formatter: {
            readonly type: import("vue").PropType<Function>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly parser: {
            readonly type: import("vue").PropType<Function>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly placeholder: {
            readonly type: import("vue").PropType<string>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly form: {
            readonly type: import("vue").PropType<string>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly readonly: BooleanConstructor;
        readonly clearable: BooleanConstructor;
        readonly showPassword: BooleanConstructor;
        readonly showWordLimit: BooleanConstructor;
        readonly suffixIcon: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component) | ((new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component))[], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly prefixIcon: {
            readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component) | ((new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component))[], unknown, unknown>>;
            readonly required: false;
            readonly validator: ((val: unknown) => boolean) | undefined;
            __epPropKey: true;
        };
        readonly containerRole: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, undefined, boolean>;
        readonly tabindex: import("element-plus/es/utils").EpPropFinalized<readonly [StringConstructor, NumberConstructor], unknown, unknown, 0, boolean>;
        readonly validateEvent: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
        readonly inputStyle: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue) | ((new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue))[], unknown, unknown, () => import("element-plus/es/utils").Mutable<{}>, boolean>;
        readonly autofocus: BooleanConstructor;
        readonly rows: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 2, boolean>;
    }>> & {
        "onUpdate:modelValue"?: ((value: string) => any) | undefined;
        onChange?: ((value: string) => any) | undefined;
        onCompositionend?: ((evt: CompositionEvent) => any) | undefined;
        onCompositionstart?: ((evt: CompositionEvent) => any) | undefined;
        onCompositionupdate?: ((evt: CompositionEvent) => any) | undefined;
        onFocus?: ((evt: FocusEvent) => any) | undefined;
        onBlur?: ((evt: FocusEvent) => any) | undefined;
        onInput?: ((value: string) => any) | undefined;
        onKeydown?: ((evt: Event | KeyboardEvent) => any) | undefined;
        onMouseenter?: ((evt: MouseEvent) => any) | undefined;
        onMouseleave?: ((evt: MouseEvent) => any) | undefined;
        onClear?: (() => any) | undefined;
    }, {
        input: import("vue").ShallowRef<HTMLInputElement | undefined>;
        textarea: import("vue").ShallowRef<HTMLTextAreaElement | undefined>;
        ref: import("vue").ComputedRef<HTMLInputElement | HTMLTextAreaElement | undefined>;
        textareaStyle: import("vue").ComputedRef<import("vue").StyleValue>;
        autosize: import("vue").Ref<import("element-plus").InputAutoSize>;
        isComposing: import("vue").Ref<boolean>;
        focus: () => void | undefined;
        blur: () => void | undefined;
        select: () => void;
        clear: () => void;
        resizeTextarea: () => void;
    }, {}, {}, {}, {
        readonly disabled: boolean;
        readonly id: string;
        readonly type: string;
        readonly modelValue: import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | number) | (() => string | number | null | undefined) | ((new (...args: any[]) => string | number) | (() => string | number | null | undefined))[], unknown, unknown>;
        readonly tabindex: import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>;
        readonly readonly: boolean;
        readonly autosize: import("element-plus").InputAutoSize;
        readonly autocomplete: string;
        readonly containerRole: string;
        readonly validateEvent: import("element-plus/es/utils").EpPropMergeType<BooleanConstructor, unknown, unknown>;
        readonly inputStyle: import("vue").StyleValue;
        readonly rows: number;
        readonly clearable: boolean;
        readonly showPassword: boolean;
        readonly showWordLimit: boolean;
        readonly autofocus: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly ariaLabel: StringConstructor;
    readonly id: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, undefined, boolean>;
    readonly size: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<StringConstructor, "" | "small" | "default" | "large", never>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly disabled: BooleanConstructor;
    readonly modelValue: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string | number) | (() => string | number | null | undefined) | ((new (...args: any[]) => string | number) | (() => string | number | null | undefined))[], unknown, unknown, "", boolean>;
    readonly maxlength: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly minlength: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly type: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "text", boolean>;
    readonly resize: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<StringConstructor, "none" | "both" | "horizontal" | "vertical", unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly autosize: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => boolean | {
        minRows?: number;
        maxRows?: number;
    }) | (() => import("element-plus").InputAutoSize) | ((new (...args: any[]) => boolean | {
        minRows?: number;
        maxRows?: number;
    }) | (() => import("element-plus").InputAutoSize))[], unknown, unknown, false, boolean>;
    readonly autocomplete: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "off", boolean>;
    readonly formatter: {
        readonly type: import("vue").PropType<Function>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly parser: {
        readonly type: import("vue").PropType<Function>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly placeholder: {
        readonly type: import("vue").PropType<string>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly form: {
        readonly type: import("vue").PropType<string>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly readonly: BooleanConstructor;
    readonly clearable: BooleanConstructor;
    readonly showPassword: BooleanConstructor;
    readonly showWordLimit: BooleanConstructor;
    readonly suffixIcon: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component) | ((new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly prefixIcon: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component) | ((new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly containerRole: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, undefined, boolean>;
    readonly tabindex: import("element-plus/es/utils").EpPropFinalized<readonly [StringConstructor, NumberConstructor], unknown, unknown, 0, boolean>;
    readonly validateEvent: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
    readonly inputStyle: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue) | ((new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue))[], unknown, unknown, () => import("element-plus/es/utils").Mutable<{}>, boolean>;
    readonly autofocus: BooleanConstructor;
    readonly rows: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 2, boolean>;
}>> & {
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onChange?: ((value: string) => any) | undefined;
    onCompositionend?: ((evt: CompositionEvent) => any) | undefined;
    onCompositionstart?: ((evt: CompositionEvent) => any) | undefined;
    onCompositionupdate?: ((evt: CompositionEvent) => any) | undefined;
    onFocus?: ((evt: FocusEvent) => any) | undefined;
    onBlur?: ((evt: FocusEvent) => any) | undefined;
    onInput?: ((value: string) => any) | undefined;
    onKeydown?: ((evt: Event | KeyboardEvent) => any) | undefined;
    onMouseenter?: ((evt: MouseEvent) => any) | undefined;
    onMouseleave?: ((evt: MouseEvent) => any) | undefined;
    onClear?: (() => any) | undefined;
}, {
    input: import("vue").ShallowRef<HTMLInputElement | undefined>;
    textarea: import("vue").ShallowRef<HTMLTextAreaElement | undefined>;
    ref: import("vue").ComputedRef<HTMLInputElement | HTMLTextAreaElement | undefined>;
    textareaStyle: import("vue").ComputedRef<import("vue").StyleValue>;
    autosize: import("vue").Ref<import("element-plus").InputAutoSize>;
    isComposing: import("vue").Ref<boolean>;
    focus: () => void | undefined;
    blur: () => void | undefined;
    select: () => void;
    clear: () => void;
    resizeTextarea: () => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    input: (value: string) => void;
    clear: () => void;
    "update:modelValue": (value: string) => void;
    change: (value: string) => void;
    blur: (evt: FocusEvent) => void;
    compositionend: (evt: CompositionEvent) => void;
    compositionstart: (evt: CompositionEvent) => void;
    compositionupdate: (evt: CompositionEvent) => void;
    focus: (evt: FocusEvent) => void;
    keydown: (evt: Event | KeyboardEvent) => void;
    mouseenter: (evt: MouseEvent) => void;
    mouseleave: (evt: MouseEvent) => void;
}, string, {
    readonly disabled: boolean;
    readonly id: string;
    readonly type: string;
    readonly modelValue: import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | number) | (() => string | number | null | undefined) | ((new (...args: any[]) => string | number) | (() => string | number | null | undefined))[], unknown, unknown>;
    readonly tabindex: import("element-plus/es/utils").EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown>;
    readonly readonly: boolean;
    readonly autosize: import("element-plus").InputAutoSize;
    readonly autocomplete: string;
    readonly containerRole: string;
    readonly validateEvent: import("element-plus/es/utils").EpPropMergeType<BooleanConstructor, unknown, unknown>;
    readonly inputStyle: import("vue").StyleValue;
    readonly rows: number;
    readonly clearable: boolean;
    readonly showPassword: boolean;
    readonly showWordLimit: boolean;
    readonly autofocus: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        prepend?(_: {}): any;
        prefix?(_: {}): any;
        suffix?(_: {}): any;
        append?(_: {}): any;
    };
})> | null>;
declare const internalValue: import("vue").Ref<string, string>;
declare const hasError: import("vue").ComputedRef<boolean>;
declare const onEdit: () => void;
declare const onCheck: () => void;
declare const onSelect: (item: SelectOption) => void;
declare const onCancel: () => void;
declare const CellActions: () => JSX.Element;
declare const labelValue: import("vue").ComputedRef<string>;
declare const isJson: import("vue").ComputedRef<boolean>;
declare const dialogVisible: import("vue").Ref<boolean, boolean>;
declare const onView: () => void;
declare const onHide: () => void;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_1: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    default?: (props: typeof __VLS_1) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    ElInput: typeof ElInput;
    ElAutocomplete: typeof ElAutocomplete;
    JsonEditorVue: typeof JsonEditorVue;
    ClIcon: typeof ClIcon;
    t: typeof t;
    inputRef: typeof inputRef;
    internalValue: typeof internalValue;
    hasError: typeof hasError;
    onEdit: typeof onEdit;
    onCheck: typeof onCheck;
    onSelect: typeof onSelect;
    onCancel: typeof onCancel;
    CellActions: typeof CellActions;
    labelValue: typeof labelValue;
    isJson: typeof isJson;
    dialogVisible: typeof dialogVisible;
    onView: typeof onView;
    onHide: typeof onHide;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    edit: (val: boolean) => any;
    change: (val: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onEdit?: ((val: boolean) => any) | undefined;
    onChange?: ((val: string) => any) | undefined;
}>, {
    triggerOnFocus: boolean;
    autoFocus: boolean;
    automaticDropdown: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    edit: (val: boolean) => any;
    change: (val: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onEdit?: ((val: boolean) => any) | undefined;
    onChange?: ((val: string) => any) | undefined;
}>, {
    triggerOnFocus: boolean;
    autoFocus: boolean;
    automaticDropdown: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
