<script setup lang="ts">
import { CanvasItem, TrackItem } from "../../types.ts";

interface Props {
  track: TrackItem,
  canvasItem: CanvasItem
}

import { computed, Ref, ref } from "vue";
import { ResizeDirection } from "./MediaTracksTypes.ts";
import Draggable from "../Draggable.vue";
import { useCanvasUtilsStore } from "../../store/canvasUtilsStore.ts";

const { track, canvasItem } = defineProps<Props>();

// TODO should access the store whatsoever
const offset = ref(0);
const left = ref(canvasItem.start / 160); // TODO do we need canvasItem.start and preview.start ?
const width = ref(canvasItem.duration / 160);
const resizing = ref(false) as Ref <ResizeDirection|boolean>
const { moveTrackItem, resizeTrackItem } = useCanvasUtilsStore();

const mediaTrackItemStyles = computed(() => {
  return {
    width: `${width.value}rem`,
    transform: `translateX(${left.value}rem)`,
    backgroundImage: `url(${track.src})`,
    backgroundSize: `${track.size}rem`
  }
});

const skalatoneStyles = computed(() => {
  return {
    left: resizing.value === ResizeDirection.Left ? `${offset.value}px` : 0,
    right: resizing.value === ResizeDirection.Right ? `${-offset.value}px` : 0,
  }
})

function handleDrag(e: number) {
  const offsetX = left.value + e / 16 < 0 ? 0 : left.value + e / 16;
  moveTrackItem(track.renderItemId, offsetX); // TODO emit event and capture on top
  // we should have some separation of concerns regarding store usage e.g only some type of components can access the store.
}

function resize(e: number) {
  //TODO
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
  resizeTrackItem(track.renderItemId, _left, _width); // TODO move one layer or 2 layers up
}
</script>

<template>
  <div class="media-track">
    <Draggable
        :with-skalatone="true"
        :style="mediaTrackItemStyles"
        @drag="handleDrag"
        cursor="move"
        class="media-track-item"
    >
      <div :style="skalatoneStyles" v-if="resizing" class="media-track-item-resize-skalatone"></div>

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
    </Draggable>
  </div>
</template>

<style lang="scss" scoped>
.media-track-item {
  height: 100%;
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
  height: 2.5rem;
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