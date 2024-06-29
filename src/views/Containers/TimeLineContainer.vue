<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";

import TimeLine from "../../components/TimeLine.vue";
import { useCanvasItemsStore } from "../../store/canvasItemsStore.ts";

const canvasItemsStore = useCanvasItemsStore();
const { canvasItems } = storeToRefs(canvasItemsStore);

const trackItems = computed(() => {
  return canvasItems.value.map(item => item.preview)
});
</script>

<template>
  <div class="timeline-container">
    <TimeLine :tracks="trackItems"/>
  </div>
</template>

<style lang="scss" scoped>

.timeline-container {
  overflow: hidden;
}
</style>