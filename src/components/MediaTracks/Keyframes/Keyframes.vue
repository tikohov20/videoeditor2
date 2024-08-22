<script setup lang="ts">
import { KeyFrames } from "@/lib/shared/types.ts";
import Keyframe from "@/components/MediaTracks/Keyframes/Keyframe.vue";

interface Props {
  keyFrames?: KeyFrames | null
}

const { keyFrames } = defineProps<Props>();
const emit = defineEmits(['update:time'])

const handleClick = ({ time }: { time: number }) => {
  emit('update:time', time);
}
</script>

<template>
  <div class="keyframes">
    <Keyframe @click="handleClick" v-for="(keyFrame, key) of keyFrames" :key-frame="keyFrame" :time="key"  />
  </div>
</template>

<style lang="scss" scoped>
.keyframes {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
}
</style>