import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils/store';
import {
  TAB_NAME_OVERVIEW,
  TAB_NAME_PATTERNS,
  TAB_NAME_TASKS,
} from '@/constants/tab';
import { translate } from '@/utils/i18n';
import useRequest from '@/services/request';
import { getViewPortOptions } from '@/utils';

// i18n
const t = translate;

const { post } = useRequest();

const state = {
  ...getDefaultStoreState<AutoProbe>('autoprobe'),
  newFormFn: () => {
    return {
      run_on_create: true,
      viewport: getViewPortOptions().find(v => v.value === 'pc-normal')
        ?.viewport,
    };
  },
  tabs: [
    { id: TAB_NAME_OVERVIEW, title: t('common.tabs.overview') },
    { id: TAB_NAME_TASKS, title: t('common.tabs.tasks') },
    { id: TAB_NAME_PATTERNS, title: t('common.tabs.patterns') },
  ],
} as AutoProbeStoreState;

const getters = {
  ...getDefaultStoreGetters<AutoProbe>(),
} as AutoProbeStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<AutoProbe>(),
} as AutoProbeStoreMutations;

const actions = {
  ...getDefaultStoreActions<AutoProbe>('/ai/autoprobes'),
  runTask: async (
    _: StoreActionContext<AutoProbeStoreState>,
    { id }: { id: string }
  ) => {
    await post(`/ai/autoprobes/${id}/tasks`);
  },
  cancelTask: async (
    _: StoreActionContext<AutoProbeStoreState>,
    { id }: { id: string }
  ) => {
    await post(`/ai/autoprobes/tasks/${id}/cancel`);
  },
} as AutoProbeStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as AutoProbeStoreModule;
