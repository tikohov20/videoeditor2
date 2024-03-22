<script setup lang="ts">

import LayerPreview from "../Layers/LayerPreview.vue";
import { usePlayerElementsStore } from "../../store";
import { storeToRefs } from "pinia";
const playerStore = usePlayerElementsStore();
const { activeElement } = storeToRefs(playerStore);

function handleInput(e: any) {
  playerStore.updateCanvasItemLayout(e.id, e)
}
</script>

<template>
  <div class="layer-preview-container">
    <LayerPreview :canvas-item="activeElement" @input="handleInput" />
  </div>
</template>

<style scoped lang="scss">
.layer-preview-container {
  border: 1px solid #555555;
}
</style>