<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useCanvasItemsStore } from "../../store/canvasItemsStore.ts";
import Actions from "@/views/Layers/Actions/Actions.vue";

const canvasItemsStore = useCanvasItemsStore();
const { canvasItems } = storeToRefs(canvasItemsStore);

</script>

<template>
  <div class="layers-container">
    <div class="layer-hat">
      Info here, later
    </div>
    <Actions :layers="canvasItems" />
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
    //opacity: .2;
    background: #202020;
  }
}
</style>