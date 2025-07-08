export declare const getRepoExternalPath: (repo: DependencyRepo) => string | undefined;
export declare const getRepoName: (repo: DependencyRepo) => string | undefined;
export declare const getEmptyDependency: () => Dependency;
export declare const getNormalizedDependencies: (dependencies?: Dependency[]) => Dependency[];
export declare const isDependencyLoading: (dep: Dependency) => boolean;
export declare const getTypeByDep: (dep: Dependency) => BasicType | undefined;
