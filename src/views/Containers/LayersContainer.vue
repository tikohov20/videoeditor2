<script setup lang="ts">
import { storeToRefs } from "pinia";

import Layers from "../Layers/Layers.vue";
import { useCanvasItemsStore } from "../../store/canvasItemsStore.ts";

const canvasItemsStore = useCanvasItemsStore();
const { canvasItems } = storeToRefs(canvasItemsStore);

function handleInput(e: any) {
  // console.log(e);
}
</script>

<template>
  <div class="layers-container">
    <div class="layer-hat">

    </div>
    <Layers :layers="canvasItems" @input="handleInput" />
  </div>
</template>

<style lang="scss" scoped>
.layers-container {
  user-select: none;
  -webkit-user-select: none;
  border-top: 0.25rem solid #1a1a1a;
  border-bottom: 0.25rem solid #1a1a1a;
  .layer-hat {
    height: 2rem;
    opacity: .2;
    background: black;
  }
}
</style>