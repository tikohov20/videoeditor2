<script setup lang="ts">
import Ruler from "./Ruler.vue";
import MediaTracks from "./MediaTracks/MediaTracks.vue";
import Indicator from "./Indicator.vue";
import { computed, ref } from "vue";
import { TrackItems } from "../types.ts";
import { usePlayerElementsStore } from "../store";
let time = ref(0);

interface Props {
  tracks: TrackItems,
}

const state = usePlayerElementsStore();

const { tracks } = defineProps<Props>();

const indicatorOffset = computed({
  get() {
    return time.value * 1e-1;
  },
  set(value) {
    time.value = value * 1e1;
    state.updateTimeStamp(time.value);
  }
});
</script>

<template>
  <div class="timeline">
    <Ruler />
    <Indicator v-model="indicatorOffset" />
    <MediaTracks :canvasItems="state.canvasItems" :tracks="tracks" />
  </div>
</template>

<style lang="scss" scoped>
.timeline {
  height: 100%;
  font-size: .625rem;
  overflow-x: auto;
  width: 100%;
  background: #242424;
  position: relative;
  user-select: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>