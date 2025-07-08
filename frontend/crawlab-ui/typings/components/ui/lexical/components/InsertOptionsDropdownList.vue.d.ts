import { LexicalEditor } from 'lexical';
type __VLS_Props = {
    visible?: boolean;
    editor: LexicalEditor;
    toolbarRef: HTMLDivElement | null;
    buttonRef: HTMLButtonElement | null;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    hide: () => any;
    insertVariable: () => any;
    insertTable: () => any;
    insertImage: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onHide?: (() => any) | undefined;
    onInsertVariable?: (() => any) | undefined;
    onInsertTable?: (() => any) | undefined;
    onInsertImage?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
