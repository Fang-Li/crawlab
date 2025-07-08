import { LexicalEditor } from 'lexical';
type __VLS_Props = {
    visible?: boolean;
    editor: LexicalEditor;
    toolbarRef: HTMLDivElement | null;
    buttonRef: HTMLButtonElement | null;
    blockType: BlockType;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    hide: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onHide?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
