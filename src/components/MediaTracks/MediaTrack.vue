<script setup lang="ts">
import { computed, Ref, ref } from "vue";
import { storeToRefs } from "pinia";

import { useLayoutStore } from "@/store/layout/layoutStore.ts";
import { useTimeStore } from "@/store/timeStore.ts";

import { CanvasItem, TrackItem } from "@/types.ts";
import { ResizeDirection } from "./MediaTracksTypes.ts";

import Draggable from "../Draggable.vue";
import Keyframes from "@/components/MediaTracks/Keyframes/Keyframes.vue";

interface Props {
  track: TrackItem,
  canvasItem: CanvasItem
}

const { track, canvasItem } = defineProps<Props>();
const emit = defineEmits(['moveTrackItem', 'resizeTrackItem']);

const layoutStore = useLayoutStore();
const timeStore = useTimeStore();
const { timeStamp } = storeToRefs(timeStore);

const offset = ref(0);
const left = ref(canvasItem.start / 160);
const width = ref(canvasItem.duration / 160);
const resizing = ref(false) as Ref <ResizeDirection|boolean>

const mediaTrackItemStyles = computed(() => {
  return {
    width: `${width.value}rem`,
    transform: `translateX(${left.value}rem)`,
    backgroundImage: `url(${track.src})`,
    backgroundSize: `${track.size}rem`,
  }
});

const skalatoneStyles = computed(() => {
  return {
    left: resizing.value === ResizeDirection.Left ? `${offset.value}px` : 0,
    right: resizing.value === ResizeDirection.Right ? `${-offset.value}px` : 0,
  }
});

const height = computed(() => {
  return layoutStore.getLayerTrackHeight(track.renderItemId)
});

function handleDrag(e: number) {
  const offsetX = left.value + e / 16 < 0 ? 0 : left.value + e / 16;
  emit('moveTrackItem', track.renderItemId, offsetX);
  // moveTrackItem(track.renderItemId, offsetX); // TODO emit event and capture on top
  // we should have some separation of concerns regarding store usage e.g only some type of components can access the store.
}

function resize(e: number) {
  let _left = 0;
  let _width = 0;

  switch (resizing.value) {
    case ResizeDirection.Left:
      _left = left.value + e / 16;
      _width = width.value - e / 16;
      break;
    case ResizeDirection.Right:
      _width = width.value + e / 16;
      _left = left.value;
  }

  emit('resizeTrackItem', track.renderItemId, _left, _width);
  // resizeTrackItem(track.renderItemId, _left, _width); // TODO move one layer or 2 layers up
}

function handleKeyframeClick(time: number) {
  timeStamp.value = time;
}
</script>

<template>
  <div class="media-track" :style="{height: `${height}px`}">
    <Keyframes @update:time="handleKeyframeClick" :key-frames="canvasItem.keyframes" class="keyframes" />

    <Draggable
        :with-skalatone="true"
        :style="mediaTrackItemStyles"
        @drag="handleDrag"
        cursor="move"
        class="media-track-item"
    >
      <Draggable
          v-model:offset="offset"
          :with-skalatone="true"
          :cursor-on-drag="false"
          @drag="resize"
          @drag-start="resizing = ResizeDirection.Left"
          @drag-end="resizing = false"
          cursor="w-resize"
          class="media-track-item-resize-left"
          skalatone-border="none"
      />

      <Draggable
          v-model:offset="offset"
          :with-skalatone="true"
          :cursor-on-drag="false"
          @drag="resize"
          @drag-start="resizing = ResizeDirection.Right"
          @drag-end="resizing = false"
          cursor="e-resize"
          class="media-track-item-resize-right"
          skalatone-border="none"
      />
      <div :style="skalatoneStyles" v-if="resizing" class="media-track-item-resize-skalatone"></div>
    </Draggable>
  </div>
</template>

<style lang="scss" scoped>
.media-track-item {
  height: $timelineLayerHeight;
  background-color: #1a1a1a;
  position: relative;
  background-size: contain;
  background-repeat: repeat-x;
  &.resizing {
    border: 1px solid #266dcd;
    border-left: none;
  }
}
.media-track {
  position: relative;
}
.media-track-item-resize-right {
  position: absolute;
  width: .5rem;
  top: 0;
  bottom: 0;
  right: 0;
}
.media-track-item-resize-left {
  position: absolute;
  width: .5rem;
  top: 0;
  bottom: 0;
  left: 0;
}

.media-track-item-resize-skalatone {
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
  border: 1px solid #266dcd;
  top: 0;
}
</style>