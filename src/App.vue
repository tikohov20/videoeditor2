<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";

import { parse } from "./lib/parsers";
import { renderTimestamp } from "./lib/renderer";
import { usePlayerElementsStore } from "./store";

import TimeLine from "./components/TimeLine.vue";
import Upload from "./components/Upload/Upload.vue";

const playerStore = usePlayerElementsStore();
const { addCanvasItem, clickOnCanvas, moveMouseInCanvas, moveTrackItem } = playerStore;
const { canvasItems, timeStamp } = storeToRefs(playerStore);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const files = ref<IFile[]>([]);

const trackItems = computed(() => {
  return canvasItems.value.map(item => item.preview)
})

watch(timeStamp, () => {
  render()
});

async function handleUpload(file: File) {
  const canvasItem = await parse(file, { width: 1024, height: 576 });
  addCanvasItem(canvasItem);
  render();
}
function render() {
  const ctx = canvasElement.value?.getContext("2d");
  if(!ctx || !canvasElement.value) return;

  renderTimestamp(canvasElement.value, ctx, timeStamp.value, canvasItems.value);
}

function handleMouseDown(event: MouseEvent) {
  const { offsetX, offsetY } = event;
  clickOnCanvas(offsetX, offsetY);
  render();
}

function handleMouseEnter(event: MouseEvent) {
  // console.log(event)
}

function handleMouseMove(event: MouseEvent) {
  // console.log(event);
}

function doStuff() {
  moveTrackItem(canvasItems.value[0].id, 10)
}
</script>

<template>
  <div>
    <div class="rename-me">
      <div class="player-container">
        <canvas
          @mousedown="handleMouseDown"
          @mouseenter="handleMouseEnter"
          @mousemove="handleMouseMove"
          ref="canvasElement"
          width="1024"
          height="576"
        />
      </div>
      <div class="timeline-container">
        <TimeLine :tracks="trackItems"/>
      </div>
      <div>
        <Upload @upload="handleUpload" v-model="files" :allowed-types="['image/jpeg', 'image/png']"/>
        <button @click="doStuff">Click me</button>
      </div>
    </div>
    <pre>
      {{ JSON.stringify(canvasItems, null, 2) }}
    </pre>
  </div>
</template>

<style lang="scss" scoped>

.rename-me {
  display: flex;
  align-items: center;
  flex-direction: column;

  .player-container {
    width: 1024px;
    height: 576px;
    background-color: #161515;
    margin-bottom: 1rem;
    margin-top: 1rem;
  }
}
.timeline-container {
  max-width: 1024px;
  border: .25rem solid #1a1a1a;
}
</style>
