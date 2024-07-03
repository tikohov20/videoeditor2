<script setup lang="ts">
import './lib/keyframes/index.ts';
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";

import { parse } from "./lib/parsers";
import { renderTimestamp } from "./lib/renderer";
import { useCanvasItemsStore } from "./store/canvasItemsStore.ts";
import Upload from "./components/Upload/Upload.vue";
import LayersContainer from "./views/Containers/LayersContainer.vue";
import TimeLineContainer from "./views/Containers/TimeLineContainer.vue";
import { exportCanvas } from "./lib/export";
import LayerPreviewContainer from "./views/Containers/LayerPreviewContainer.vue";
import { useCanvasUtilsStore } from "./store/canvas/canvasUtilsStore.ts";
import { useTimeStore } from "./store/timeStore.ts";
import { useActionHistoryStore } from "./store/actionHistoryStore.ts";

const timeStore = useTimeStore();
const { timeStamp } = storeToRefs(timeStore);
const actionHistoryStore = useActionHistoryStore();

const canvasElement = ref<HTMLCanvasElement | null>(null);
const files = ref<IFile[]>([]);

const cursor = ref('initial');

const canvasItemsStore = useCanvasItemsStore();
const canvasUtilsStore = useCanvasUtilsStore();
const { canvasItems } = storeToRefs(canvasItemsStore);

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
  // addCanvasItem(canvasItem);
  canvasItemsStore.addCanvasItem(canvasItem);
  actionHistoryStore.saveCanvasItemAction(canvasItem, null);
}
function render() {
  const ctx = canvasElement.value?.getContext("2d");
  if(!ctx || !canvasElement.value) return;

  renderTimestamp(canvasElement.value, ctx, timeStamp.value, canvasItemsStore.canvasItems);
}

let historyId = 0;

function handleMouseDown(event: MouseEvent) {
  const { offsetX, offsetY } = event;
  const { clickedItem, actionType, cursor: cursorValue } = canvasUtilsStore.clickOnCanvas(offsetX, offsetY);

  if (!clickedItem.value) return;

  cursor.value = cursorValue;

  canvasUtilsStore.initCanvasItemMouseMoveAction(
      clickedItem.value,
      clickedItem.value.x,
      clickedItem.value.y,
      offsetX,
      offsetY,
      actionType
  );

  actionHistoryStore.saveCanvasItemAction(clickedItem.value);

  render();
}

function handleMouseUp(_event: MouseEvent) {
  cursor.value = 'initial';
  canvasUtilsStore.resetCanvasItemMouseMoveAction();
}

function handleMouseEnter(_event: MouseEvent) {
  // console.log(event)
}

function handleMouseMove(event: MouseEvent) {
  canvasUtilsStore.canvasItemMouseMoveAction(event);
}

function doStuff() {
  // canvasItems.value = canvasItems.value.reverse()
  exportCanvas(canvasElement.value as HTMLCanvasElement, canvasItems.value, 0, 30000, 30, 3500_000, 1024, 576);
}

function handleKeyDown(e: KeyboardEvent) {
  console.log(e);
}

let isPreviousMetaOrCtrl = false;
window.addEventListener('keydown', function(ev: KeyboardEvent) {
  isPreviousMetaOrCtrl = ev.metaKey || ev.ctrlKey;

  if(isPreviousMetaOrCtrl && ev.code === "KeyZ") {
    ev.stopImmediatePropagation();
    actionHistoryStore.moveBack();
  }
});

</script>

<template>
  <div :style="{cursor}">
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
        <button @click="actionHistoryStore.moveBack">Back</button>
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
