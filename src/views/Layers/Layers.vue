<script setup lang="ts">
import Layer from "./Layer.vue";
import { CanvasItems } from "../../types.ts";

interface Props {
  layers: CanvasItems,
}

const { layers } = defineProps<Props>();
</script>

<template>
  <div class="layers">
    <Layer v-for="layer in layers" :key="layer.id" :layer="layer" />
  </div>
</template>

<style lang="scss" scoped>
.layers {
  :deep(.layer) {
    //grid-template-columns: 2.5rem auto auto;
    //height: 2.5rem;
    //align-items: center;
    //display: grid;
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