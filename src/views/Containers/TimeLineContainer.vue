<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";

import { usePlayerElementsStore } from "../../store";

import TimeLine from "../../components/TimeLine.vue";

const playerStore = usePlayerElementsStore();
const { canvasItems } = storeToRefs(playerStore);

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