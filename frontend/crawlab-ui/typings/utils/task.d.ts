export declare const getPriorityLabel: (priority: number) => string;
export declare const priorityOptions: SelectOption[];
export declare const isCancellable: (status?: TaskStatus) => boolean;
export declare const getModeOptions: () => SelectOption[];
export declare const getModeOptionsDict: () => Map<string, SelectOption>;
export declare const getStatusOptions: () => SelectOption[];
export declare const getToRunNodes: (mode: TaskMode, nodeIds?: string[], activeNodes?: CNode[]) => CNode[];
