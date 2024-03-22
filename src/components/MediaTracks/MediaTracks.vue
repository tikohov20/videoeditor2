<script setup lang="ts">
import MediaTrack from "./MediaTrack.vue";
import { CanvasItems, TrackItems } from "../../types.ts";

interface Props {
  tracks: TrackItems,
  canvasItems: CanvasItems
}

const { canvasItems } = defineProps<Props>();

</script>

<template>
  <div class="media-tracks">
    <MediaTrack v-for="canvasItem in canvasItems" :key="canvasItem.preview.id" :track="canvasItem.preview" :canvasItem="canvasItem"/>
  </div>
</template>

<style scoped>
</style>