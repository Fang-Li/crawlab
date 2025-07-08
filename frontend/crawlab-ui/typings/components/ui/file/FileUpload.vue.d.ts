type __VLS_Props = {
    mode: FileUploadMode;
    targetDirectory: string;
    directoryOptions?: SelectOption[];
    uploadInfo?: FileUploadInfo;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "mode-change": (mode: any) => any;
    "directory-change": (dir: string) => any;
    "files-change": (files: (FileWithPath | undefined)[]) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onMode-change"?: ((mode: any) => any) | undefined;
    "onDirectory-change"?: ((dir: string) => any) | undefined;
    "onFiles-change"?: ((files: (FileWithPath | undefined)[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
