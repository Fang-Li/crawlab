import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils/store';
import {
  TAB_NAME_MONITORING,
  TAB_NAME_OVERVIEW,
  TAB_NAME_TASKS,
} from '@/constants/tab';
import useRequest from '@/services/request';

const { get } = useRequest();

const state = {
  ...getDefaultStoreState<CNode>('node'),
  tabs: [
    { id: TAB_NAME_OVERVIEW, title: 'common.tabs.overview' },
    { id: TAB_NAME_TASKS, title: 'common.tabs.tasks' },
    { id: TAB_NAME_MONITORING, title: 'common.tabs.monitoring' },
  ],
  nodeMetricsMap: {},
  activeNodes: [],
} as NodeStoreState;

const getters = {
  ...getDefaultStoreGetters<CNode>(),
} as NodeStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<CNode>(),
  setNodeMetricsMap(state: NodeStoreState, metricsMap: Record<string, Metric>) {
    state.nodeMetricsMap = metricsMap;
  },
  setActiveNodes: (state: NodeStoreState, activeNodes: CNode[]) => {
    state.activeNodes = activeNodes;
  },
} as NodeStoreMutations;

const actions = {
  ...getDefaultStoreActions<CNode>('/nodes'),
  async getNodeMetrics({ state, commit }: StoreActionContext<NodeStoreState>) {
    const { page, size } = state.tablePagination;
    const res = await get<Record<string, Metric>>('/nodes/metrics', {
      page,
      size,
      conditions: JSON.stringify(state.tableListFilter),
      // sort: JSON.stringify(state.tableListSort),
    } as ListRequestParams);
    commit('setNodeMetricsMap', res.data);
    return res;
  },
  async getActiveNodes({ commit }: StoreActionContext<NodeStoreState>) {
    const res = await get<CNode[]>('/nodes');
    commit('setActiveNodes', res.data || []);
    return res;
  },
} as NodeStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as NodeStoreModule;
