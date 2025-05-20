<script setup lang="ts">
import {
  type CSSProperties,
  onMounted,
  ref,
  computed,
  watch,
  onBeforeUnmount,
} from 'vue';
import useRequest from '@/services/request';
import { getIconByPageElementType } from '@/utils';
import { debounce } from 'lodash';

const props = defineProps<{
  activeId: string;
  activeNavItem?: AutoProbeNavItem;
  viewport?: PageViewPort;
}>();

const { get } = useRequest();

const previewRef = ref<HTMLDivElement | null>(null);
const previewLoading = ref(false);
const previewResult = ref<PagePreviewResult>();

const screenshotRef = ref<HTMLDivElement | null>(null);
const screenshotScale = ref(1);
const updateOverlayScale = () => {
  const { viewport } = props;
  const rect = screenshotRef.value?.getBoundingClientRect();
  if (!rect) return 1;
  screenshotScale.value = rect.width / (viewport?.width ?? 1280);
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  // Initial calculation if reference is already available
  if (screenshotRef.value) {
    setupResizeObserver();
  }

  // Watch for when the reference becomes available
  watch(screenshotRef, newRef => {
    if (newRef) {
      setupResizeObserver();
    }
  });

  const handle = setInterval(() => {
    if (!screenshotRef.value) return;
    screenshotRef.value.addEventListener('resize', updateOverlayScale);
    updateOverlayScale();
    clearInterval(handle);
  }, 10);
  return () => {
    screenshotRef.value?.removeEventListener('resize', updateOverlayScale);
  };
});

const setupResizeObserver = () => {
  // Clean up existing observer if there is one
  if (resizeObserver) {
    resizeObserver.disconnect();
  }

  resizeObserver = new ResizeObserver(() => {
    updateOverlayScale();
  });

  resizeObserver.observe(screenshotRef.value!);
  updateOverlayScale();
};

// Clean up function
onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

const getPreview = debounce(async () => {
  const { activeId } = props;
  previewLoading.value = true;
  try {
    const res = await get<any, ResponseWithData<PagePreviewResult>>(
      `/ai/autoprobes/${activeId}/preview`
    );
    previewResult.value = res.data;
  } finally {
    previewLoading.value = false;
  }
});
onMounted(getPreview);

const getElementMaskStyle = (el: PageElement): CSSProperties => {
  return {
    position: 'absolute',
    left: el.coordinates.left * screenshotScale.value + 'px',
    top: el.coordinates.top * screenshotScale.value + 'px',
    width: el.coordinates.width * screenshotScale.value + 'px',
    height: el.coordinates.height * screenshotScale.value + 'px',
  };
};

const pageElements = computed<PageElement[]>(() => {
  const { activeNavItem } = props;
  if (!activeNavItem) {
    return previewResult.value?.page_elements ?? [];
  }
  if (!previewResult.value?.page_elements) {
    return [];
  }
  if (activeNavItem.type === 'page_pattern') {
    return previewResult.value.page_elements;
  } else if (activeNavItem.type === 'list') {
    const listElement = previewResult.value.page_elements.find(
      el => el.name === activeNavItem.name
    );
    if (!listElement) {
      return [];
    }
    const itemElements = listElement.children ?? [];
    const fieldElements = itemElements.flatMap(el => el.children ?? []);
    return [...itemElements, ...fieldElements];
  } else if (activeNavItem.type === 'field') {
    return (
      previewResult.value.page_elements.filter(
        el => el.name === activeNavItem.name
      ) ?? []
    );
  } else {
    return [];
  }
});

defineExpose({
  updateOverlayScale,
});

defineOptions({ name: 'ClAutoProbeResultsPreview' });
</script>

<template>
  <div ref="previewRef" class="preview">
    <div v-loading="previewLoading" class="preview-container">
      <div v-if="previewResult" class="preview-overlay">
        <img ref="screenshotRef" class="screenshot" :src="previewResult.screenshot_base64" />
        <div
          v-for="(el, index) in pageElements"
          :key="index"
          class="element-mask"
          :style="getElementMaskStyle(el)"
        >
          <el-badge type="primary" :badge-style="{ opacity: 0.8 }">
            <template #content>
              <span style="margin-right: 5px">
                <cl-icon :icon="getIconByPageElementType(el.type)" />
              </span>
              {{ el.name }}
            </template>
          </el-badge>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview {
  overflow: hidden;
  height: calc(100% - 41px);

  .preview-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
    scrollbar-width: none;

    .preview-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1;

      img.screenshot {
        width: fit-content;
        max-width: 100%;
      }

      .element-mask {
        border: 1px solid var(--el-color-primary-light-5);
        border-radius: 4px;
        z-index: 1;

        &:hover {
          background: rgba(64, 156, 255, 0.2);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
