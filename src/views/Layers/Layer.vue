<script setup lang="ts">
import { CanvasItem } from "../../types.ts";
import { usePlayerElementsStore } from "../../store";

interface Props {
  layer: CanvasItem
}

const { removeCanvasItem } = usePlayerElementsStore();

const { layer } = defineProps<Props>();
</script>


<template>
  <div class="layer">
    <div>&lt;0&gt;</div>
    <div>{{ layer.name }}</div>
    <div @click="removeCanvasItem(layer.id)">X</div>
  </div>
</template>