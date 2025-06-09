type NodeStoreModule = BaseModule<
  NodeStoreState,
  NodeStoreGetters,
  NodeStoreMutations,
  NodeStoreActions
>;

interface NodeStoreState extends BaseStoreState<CNode> {
  nodeMetricsMap: Record<string, Metric>;
  activeNodes: CNode[];
}

type NodeStoreGetters = BaseStoreGetters<CNode>;

interface NodeStoreMutations extends BaseStoreMutations<CNode> {
  setNodeMetricsMap: StoreMutation<NodeStoreState, Record<string, Metric>>;
  setActiveNodes: StoreMutation<NodeStoreState, CNode[]>;
}

interface NodeStoreActions extends BaseStoreActions<CNode> {
  getNodeMetrics: StoreAction<NodeStoreState>;
  getActiveNodes: StoreAction<NodeStoreState>;
}
