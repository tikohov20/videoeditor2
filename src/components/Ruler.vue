<script setup lang="ts">
import {computed, ref} from "vue";
import Markings from "./Markings.vue";

let duration = ref(30e3);

const markingsEnd = computed(() => {
  return duration.value * 1e-3;
})


</script>

<template>
  <div class="ruler">
    <Markings :end="markingsEnd" />
  </div>
</template>

<style lang="scss" scoped>
.ruler {
  height: 2rem;
}
</style>