<script setup lang="ts">
import TimeLine from "./components/TimeLine.vue";
import Upload from "./components/Upload/Upload.vue";
import {ref, watch} from "vue";
import { parse } from "./lib/parsers";
import { renderTimestamp } from "./lib/renderer";
import { usePlayerElementsStore } from "./store";
import { storeToRefs } from "pinia";

const playerStore = usePlayerElementsStore();
const { addTrackItem, addCanvasItem } = playerStore;
const { trackItems, canvasItems, timeStamp } = storeToRefs(playerStore);

const canvasElement = ref<HTMLCanvasElement | null>(null);
const files = ref<IFile[]>([]);

watch(timeStamp, () => {
  render()
})
async function handleUpload(file: File) {
  const { preview, data } = await parse(file);
  addTrackItem(preview);
  addCanvasItem(data);
  render();
}
function render() {
  const ctx = canvasElement.value?.getContext("2d");
  if(!ctx || !canvasElement.value) return;

  renderTimestamp(canvasElement.value, ctx, timeStamp.value, canvasItems.value);

}
</script>

<template>
  <div>
    <div class="rename-me">
      <div class="player-container">
        <canvas
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
      </div>
    </div>
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
  }
}
.timeline-container {
  max-width: 1024px;
  border: .25rem solid #1a1a1a;
}
</style>
