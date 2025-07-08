type HandleNodeFn<T extends TreeNode> = (parentNode: T, node: T) => T;
export declare const normalizeTree: <T extends TreeNode>(nodes: T[], handleNodeFn?: HandleNodeFn<T>) => T[];
export {};
