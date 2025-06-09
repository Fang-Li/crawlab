<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import useRequest from '@/services/request';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    filterable?: boolean;
    remoteShowSuffix?: boolean;
    endpoint: string;
    labelKey?: string;
    valueKey?: string;
    limit?: number;
  }>(),
  {
    remoteShowSuffix: true,
    labelKey: 'name',
    valueKey: '_id',
    limit: 1000,
  }
);

const emit = defineEmits<{
  (e: 'change', value: string): void;
  (e: 'clear'): void;
  (e: 'update:model-value', value: string): void;
}>();

const { get } = useRequest();

const internalValue = ref<string | undefined>(props.modelValue);
watch(
  () => props.modelValue,
  () => {
    internalValue.value = props.modelValue;
  }
);
watch(internalValue, () =>
  emit('update:model-value', internalValue.value || '')
);

const loading = ref(false);
const list = ref([]);
const remoteMethod = async (query?: string) => {
  const { endpoint, labelKey, limit } = props;
  try {
    loading.value = true;
    let filter: string | undefined = undefined;
    if (query) {
      filter = JSON.stringify([
        { key: labelKey, op: 'contains', value: query } as FilterConditionData,
      ]);
    }
    const sort = labelKey;
    const res = await get(endpoint, { filter, limit, sort });
    list.value = res.data || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
const selectOptions = computed<SelectOption[]>(() =>
  list.value.map(row => ({
    label: row[props.labelKey],
    value: row[props.valueKey],
  }))
);
onBeforeMount(remoteMethod);

defineOptions({ name: 'ClRemoteSelect' });
</script>

<template>
  <el-select
    v-model="internalValue"
    :placeholder="placeholder"
    :filterable="filterable"
    :disabled="disabled"
    remote
    :remote-method="remoteMethod"
    :remote-show-suffix="remoteShowSuffix"
    @change="(value: any) => emit('change', value)"
    @clear="() => emit('clear')"
  >
    <el-option
      v-for="(op, index) in selectOptions"
      :key="index"
      :label="op.label"
      :value="op.value"
    />
    <template #label>
      <slot name="label" />
    </template>
  </el-select>
</template>
