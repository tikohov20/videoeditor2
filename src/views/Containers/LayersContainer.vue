<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePlayerElementsStore } from "../../store";

import Layers from "../Layers/Layers.vue";

const playerStore = usePlayerElementsStore();
const { canvasItems } = storeToRefs(playerStore);

function handleInput(e: any) {
  console.log(e);
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
  border-top: 0.25rem solid #1a1a1a;
  border-bottom: 0.25rem solid #1a1a1a;
  .layer-hat {
    height: 2rem;
    opacity: .2;
    background: black;
  }
}
</style>