<script setup lang="ts">
import { CanvasItem } from "../../types.ts";
import { useCanvasItemsStore } from "../../store/canvasItemsStore.ts";

interface Props {
  layer: CanvasItem
}

const { removeCanvasItem } = useCanvasItemsStore();

const { layer } = defineProps<Props>();
</script>


<template>
  <div class="layer">
    <div>&lt;0&gt;</div>
    <div>{{ layer.name }}</div>
    <div @click="removeCanvasItem(layer.id)">X</div>
  </div>
</template>