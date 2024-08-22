<script setup lang="ts">

import { KeyFrame } from "@/lib/shared/types.ts";

interface Props {
  keyFrame: KeyFrame,
  time: number
}
const keyframeStyles = (keyFrame, time: number) => {
  return {
    transform: `translate(calc(${time / 160}rem - 50%), -50%)`
  }
}

const { keyFrame, time } = defineProps<Props>();
const emit = defineEmits(['click'])

</script>

<template>
  <a @click="emit('click', { keyFrame, time })" class="keyframe" :style="keyframeStyles(keyFrame, time)">
  </a>
</template>

<style lang="scss" scoped>
.keyframe {
  background: #266dcd;
  display: block;
  cursor: pointer;
  position: absolute;
  pointer-events: all;
  width: 10px;
  height: 10px;
  top: calc($timelineLayerHeight / 2);
}
</style>