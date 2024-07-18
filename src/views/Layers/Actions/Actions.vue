<script setup lang="ts">
import Layer from "../Layer.vue";
import { CanvasItems } from "../../../types.ts";
import { onMounted, ref, toRefs, watch } from "vue";
import { ResizeObserverEntry, useResizeObserver } from "@vueuse/core";
import { useLayoutStore } from "@/store/layout/layoutStore.ts";
import { number } from "mathjs";
import Action from "@/views/Layers/Actions/Action.vue";

const layoutStore = useLayoutStore();

interface Props {
  layers: CanvasItems,
}

const props = defineProps<Props>();
const { layers } = toRefs(props);

const layersElement = ref<any[] | null>(null);

let observers: Array<any> = [];

watch(layers, () => {
  observers.forEach(observer => {
    observer.stop();
  });
  layersElement.value?.forEach((element) => {
    observers[element.attributes['data-layer-id'].value] = useResizeObserver(element, (entries: ReadonlyArray<ResizeObserverEntry>) => {
      const entry = entries[0];
      // @ts-ignore
      layoutStore.setLayerTrackHeight(number(entry.target.attributes['data-layer-id'].value), entry.contentRect.height)
    });
  });
}, {
  deep: true
})
</script>

<template>
  <div class="layers" >
    <div ref="layersElement" v-for="layer in layers" :key="layer.id" :data-layer-id="layer.id">
      <Action :layer="layer" :id="layer.id" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layers {
  :deep(.layer) {
    &:not(:last-child) {
      border-bottom: 1px solid #1a1a1a;
    }
    &:nth-child(1) {
      flex-grow: 1;
      width: 100%;
    }

    > div {
      text-align: right;
    }
  }
}
</style>