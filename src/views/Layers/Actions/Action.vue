<script setup lang="ts">
import { CanvasItem } from "@/types.ts";
import { useCanvasItemsStore } from "@/store/canvasItemsStore.ts";
import AccordionWrapper from "@/views/Layers/Actions/Accordion/AccordionWrapper.vue";

interface Props {
  layer: CanvasItem
}

const { removeCanvasItem, hideCanvasItem, updateCanvasItemName } = useCanvasItemsStore();

const { layer } = defineProps<Props>();

function handleSave(e: FocusEvent, layer: CanvasItem) {
  updateCanvasItemName(layer.id, e.target?.innerText);
}

</script>

<template>
  <div class="layer">
    <AccordionWrapper
        @delete-layer="() => removeCanvasItem(layer.id)"
        :visible="!!layer.isHidden"
        @update:visible="() => hideCanvasItem(layer.id)"
        icon-left
        :layer="layer"
    >
      <span contenteditable spellcheck="false" @keydown.enter="(e) => e.preventDefault()" @blur="e => handleSave(e, layer)">
        {{ layer.name }}
      </span>
    </AccordionWrapper>
  </div>
</template>

<style lang="scss" scoped>
.layer {
  min-height: $timelineLayerHeight;
  display: flex;
  .accordion {
    margin: auto 0;
    width: 100%;
  }
}
</style>