<script setup lang="ts">
import { computed } from "vue";
import Draggable from "./Draggable.vue";

const props = defineProps({
  modelValue: {
    required: true,
    type: Number
  }
});

const emit = defineEmits(['update:modelValue']);

const markerOffset = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    if (value >= 0) emit('update:modelValue', value);
    else emit('update:modelValue', 0);
  }
});

const markerStyle = computed(() => {
  return {
    transform: `translate3d(${props.modelValue / 16}rem, 0, 0)`
  }
});

function handleDrag(e: number) {
  markerOffset.value += e;
}
</script>

<template>
  <Draggable @drag="handleDrag" cursor="ew-resize" :cursor-on-drag="false">
    <div :style="markerStyle" class="indicator"></div>
  </Draggable>
</template>

<style scoped>
.indicator {
  position: absolute;
  z-index: 1;
  border-left: 1px solid #266dcd;
  border-top: 20px solid #266dcd;
  width: 4px;
  cursor: ew-resize;
  bottom: 0;
  top: 0;
}
</style>