<script setup lang="ts">
import MediaTrack from "./MediaTrack.vue";
import { CanvasItems, TrackItems } from "../../types.ts";

interface Props {
  tracks: TrackItems,
  canvasItems: CanvasItems
}

const { canvasItems } = defineProps<Props>();
const emit            = defineEmits(['moveTrackItem', 'resizeTrackItem']);

</script>

<template>
  <div class="media-tracks">
    <MediaTrack
        v-for="canvasItem in canvasItems"
        :key="canvasItem.preview.id"
        :track="canvasItem.preview"
        :canvasItem="canvasItem"
        @moveTrackItem="(id, offsetX) => emit('moveTrackItem', id, offsetX)"
        @resizeTrackItem="(id, left, width) => emit('resizeTrackItem', id, left, width)"
    />
  </div>
</template>

<style scoped>
</style>