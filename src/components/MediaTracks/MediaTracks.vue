<script setup lang="ts">
import MediaTrack from "./MediaTrack.vue";
import {TrackItems} from "../../types.ts";
interface Props {
  tracks: TrackItems
}

const { tracks } = defineProps<Props>();

</script>

<template>
  <div class="media-tracks">
    <MediaTrack v-for="mediaTrack in tracks" :key="mediaTrack.id" :track="mediaTrack"/>
  </div>
</template>

<style scoped>
</style>