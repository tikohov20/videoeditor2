<script setup lang="ts">
import { CanvasItem } from "@/types.ts";
import { useCanvasItemsStore } from "@/store/canvasItemsStore.ts";

import Accordion from "@/components/Accordion/Accordion.vue";
import LayerAccordion from "@/views/LayerAccordion.vue";

interface Props {
  layer: CanvasItem
}

const { removeCanvasItem, hideCanvasItem } = useCanvasItemsStore();

const { layer } = defineProps<Props>();
</script>


<template>
  <div class="layer">
    <LayerAccordion :visible="!!layer.isHidden" @update:visible="() => hideCanvasItem(layer.id)" icon-left>
      <span>
        {{ layer.name }}
      </span>

      <template #content>
      </template>
    </LayerAccordion>
  </div>
</template>

<style lang="scss" scoped>
.layer {
  min-height: 40px;
  display: flex;
  .accordion {
    margin: auto 0;
    width: 100%;
  }
}
</style>