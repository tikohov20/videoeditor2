<script setup lang="ts">

import LayerPreview from "../Layers/LayerPreview.vue";
import { storeToRefs } from "pinia";
import { useCanvasUtilsStore } from "../../store/canvasUtilsStore.ts";
import { useCanvasItemsStore } from "../../store/canvasItemsStore.ts";

const canvasUtilsStore = useCanvasUtilsStore();
const canvasItemsStore = useCanvasItemsStore();

const { activeItem } = storeToRefs(canvasUtilsStore)

function handleInput(e: any) {
  canvasItemsStore.updateCanvasItemProperties(e.id, e)
}
</script>

<template>
  <div class="layer-preview-container">
    <LayerPreview :canvas-item="activeItem" @input="handleInput" />
  </div>
</template>

<style scoped lang="scss">
.layer-preview-container {
  border: 1px solid #555555;
}
</style>