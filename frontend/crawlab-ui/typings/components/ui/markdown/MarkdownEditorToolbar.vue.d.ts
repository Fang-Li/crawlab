import * as monaco from 'monaco-editor';
type __VLS_Props = {
    editor?: monaco.editor.IStandaloneCodeEditor;
    content?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    bold: () => any;
    link: () => any;
    variable: (value: VariableForm) => any;
    undo: () => any;
    redo: () => any;
    italic: () => any;
    underline: () => any;
    strikethrough: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onBold?: (() => any) | undefined;
    onLink?: (() => any) | undefined;
    onVariable?: ((value: VariableForm) => any) | undefined;
    onUndo?: (() => any) | undefined;
    onRedo?: (() => any) | undefined;
    onItalic?: (() => any) | undefined;
    onUnderline?: (() => any) | undefined;
    onStrikethrough?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
