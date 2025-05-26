type AutoProbeStoreModule = BaseModule<
  AutoProbeStoreState,
  AutoProbeStoreGetters,
  AutoProbeStoreMutations,
  AutoProbeStoreActions
>;

interface AutoProbeStoreState extends BaseStoreState<AutoProbe> {
  pagePattern?: PagePatternV2;
  pagePatternData?: PatternDataV2[];
}

type AutoProbeStoreGetters = BaseStoreGetters<AutoProbe>;

interface AutoProbeStoreMutations extends BaseStoreMutations<AutoProbe> {
  setPagePattern: StoreMutation<AutoProbeStoreState, PagePatternV2>;
  resetPagePattern: StoreMutation<AutoProbeStoreState>;
  setPagePatternData: StoreMutation<AutoProbeStoreState, PatternDataV2[]>;
  resetPagePatternData: StoreMutation<AutoProbeStoreState>;
}

interface AutoProbeStoreActions extends BaseStoreActions<AutoProbe> {
  runTask: StoreAction<AutoProbeStoreState, { id: string }>;
  cancelTask: StoreAction<AutoProbeStoreState, { id: string }>;
  getPagePattern: StoreAction<AutoProbeStoreState, { id: string }>;
  getPagePatternData: StoreAction<AutoProbeStoreState, { id: string }>;
}
