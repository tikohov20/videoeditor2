<script setup lang="ts">
import './lib/keyframes/index.ts';
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";

import { parse } from "./lib/parsers";
import { renderTimestamp } from "./lib/renderer";
import { usePlayerElementsStore } from "./store";

import Upload from "./components/Upload/Upload.vue";
import { CanvasItem } from "./types.ts";
import LayersContainer from "./views/Containers/LayersContainer.vue";
import TimeLineContainer from "./views/Containers/TimeLineContainer.vue";
import { exportCanvas } from "./lib/export";
import LayerPreviewContainer from "./views/Containers/LayerPreviewContainer.vue";
import {getTransformationMatrix} from "./lib/shared/helpers.ts";

const playerStore = usePlayerElementsStore();
const { addCanvasItem, clickOnCanvas, moveCanvasItem } = playerStore;
const { canvasItems, timeStamp } = storeToRefs(playerStore);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const files = ref<IFile[]>([]);

watch(timeStamp, () => {
  render()
});

watch(canvasItems, () => {
  render()
}, {
  deep: true
})

async function handleUpload(file: File) {
  const canvasItem = await parse(file, { width: 1024, height: 576 });
  addCanvasItem(canvasItem);
}
function render() {
  const ctx = canvasElement.value?.getContext("2d");
  if(!ctx || !canvasElement.value) return;

  renderTimestamp(canvasElement.value, ctx, timeStamp.value, canvasItems.value);
}

const initialX = ref(0);
const initialY = ref(0);
const initialMouseX = ref(0);
const initialMouseY = ref(0);
const movingItem = ref<CanvasItem | null>(null);

function handleMouseDown(event: MouseEvent) {
  const { offsetX, offsetY } = event;
  initialMouseX.value = offsetX;
  initialMouseY.value = offsetY;
  const result = clickOnCanvas(offsetX, offsetY);

  if (result && result.value) {
    movingItem.value = result.value;
    initialX.value = movingItem.value.x;
    initialY.value = movingItem.value.y;
  }
  render();
}
const { a, b, c, d, e, f } = getTransformationMatrix({x: 0, y: 0, rotation: 45, scaleX: 1, scaleY: 1});
const matrix = [
    a, b, c, d
];
const vector = [15, 15];
const newCords = [vector[0] * matrix[0] + vector[1] * matrix[1] + e, vector[0] * matrix[2] + vector[1] * matrix[3] + f];

function handleMouseUp(_event: MouseEvent) {
  movingItem.value = null;
  initialMouseX.value = 0;
  initialMouseY.value = 0;
  initialX.value = 0;
  initialY.value = 0;
}

function handleMouseEnter(_event: MouseEvent) {
  // console.log(event)
}

function handleMouseMove(event: MouseEvent) {
  if (movingItem.value) {
    const { offsetX, offsetY } = event;
    // console.log(initialY.value + offsetY);
    moveCanvasItem(movingItem.value.id, initialX.value + offsetX - initialMouseX.value, initialY.value + offsetY - initialMouseY.value)
  }}

function doStuff() {
  // canvasItems.value = canvasItems.value.reverse()
  exportCanvas(canvasElement.value as HTMLCanvasElement, canvasItems.value, 0, 30000, 30, 3500_000, 1920, 1080);
}
</script>

<template>
  <div>
    <div class="main-content">
      <div class="top-container">
        <div class="random">
          random
        </div>
        <div class="player-container">
          <canvas
              @mousedown="handleMouseDown"
              @mouseup="handleMouseUp"
              @mouseenter="handleMouseEnter"
              @mousemove="handleMouseMove"
              ref="canvasElement"
              width="1024"
              height="576"
          />
        </div>
        <LayerPreviewContainer />
      </div>
      <div class="bottom-container">
        <LayersContainer />
        <TimeLineContainer />
      </div>
      <div>
        <Upload @upload="handleUpload" v-model="files" :allowed-types="['image/jpeg', 'image/png', 'image/gif']"/>
        <button @click="doStuff">Download</button>
      </div>
    </div>
    <pre>
      {{ JSON.stringify(canvasItems, null, 2) }}
    </pre>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  display: flex;
  align-items: center;
  flex-direction: column;

  .top-container {
    width: 100%;
    display: grid;
    grid-template-columns: auto 1024px 300px;
    margin-bottom: 1rem;
    margin-top: 1rem;
  }
  .player-container {
    width: 1024px;
    height: 576px;
    background-color: #161515;
  }
}
.timeline-container {
  max-width: 100%;
  border: .25rem solid #1a1a1a;
}
.bottom-container {
  display: grid;
  grid-template-columns: 25rem auto;
}
</style>
