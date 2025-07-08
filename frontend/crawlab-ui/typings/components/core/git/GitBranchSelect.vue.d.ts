type __VLS_Props = {
    modelValue?: string;
    localBranches: GitRef[];
    remoteBranches: GitRef[];
    disabled?: boolean;
    loading?: boolean;
    className?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    push: () => any;
    pull: () => any;
    commit: () => any;
    "select-local": (value: string) => any;
    "select-remote": (value: string) => any;
    "new-branch": () => any;
    "delete-branch": (value: string) => any;
    "update:modelValue": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onPush?: (() => any) | undefined;
    onPull?: (() => any) | undefined;
    onCommit?: (() => any) | undefined;
    "onSelect-local"?: ((value: string) => any) | undefined;
    "onSelect-remote"?: ((value: string) => any) | undefined;
    "onNew-branch"?: (() => any) | undefined;
    "onDelete-branch"?: ((value: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    localBranches: GitRef[];
    remoteBranches: GitRef[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
