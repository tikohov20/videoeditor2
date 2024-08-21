<script setup lang="ts">
import './lib/keyframes/index.ts';
import { onMounted, ref, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";

import { parse } from "./lib/parsers";
import { useCanvasItemsStore } from "./store/canvasItemsStore.ts";
import { exportCanvas } from "./lib/export";
import { useActionHistoryStore } from "./store/actionHistoryStore.ts";
import { useCanvasContextStore } from "./store/canvas/canvasContextStore.ts";
import { ParsedFile, useFilesStore } from "./store/filesStore.ts";

import Upload from "./components/Upload/Upload.vue";
import LayersContainer from "./views/Containers/LayersContainer.vue";
import TimeLineContainer from "./views/Containers/TimeLineContainer.vue";
import LayerPreviewContainer from "./views/Containers/LayerPreviewContainer.vue";
import Canvas from "./views/Canvas/Canvas.vue";
import Files from "./views/Files/Files.vue";
import { useLayoutStore } from "@/store/layout/layoutStore.ts";
import { useSettingsStore } from "@/store/settingsStore.ts";

const settingsStore = useSettingsStore();
const actionHistoryStore = useActionHistoryStore();
const canvasContextStore = useCanvasContextStore();
const canvasItemsStore = useCanvasItemsStore();
const filesStore = useFilesStore();
const layoutStore = useLayoutStore();

const { canvasItems } = storeToRefs(canvasItemsStore);
const { magnetise } = storeToRefs(settingsStore);

const canvasComponent = ref<InstanceType<typeof Canvas>>();
const files = ref<IFile[]>([]);
const cursor = ref('initial');

onMounted(() => {
  canvasContextStore.initRenderWatchers();
})

async function handleUpload(file: File) {
  await filesStore.parseFile(file);
}

function exportCanvasMP4() {
  exportCanvas(canvasContextStore.canvas as HTMLCanvasElement, canvasItems.value, 0, 3000, 30, 3_500_000, layoutStore.canvasData.width, layoutStore.canvasData.height);
}

let isPreviousMetaOrCtrl = false;
window.addEventListener('keydown', function(ev: KeyboardEvent) {
  isPreviousMetaOrCtrl = ev.metaKey || ev.ctrlKey;

  if(isPreviousMetaOrCtrl && ev.code === "KeyZ") {
    ev.stopImmediatePropagation();
    actionHistoryStore.moveBack();
  }
});

async function handleAddFileToCanvas(file: ParsedFile) {
  const canvasWidth = layoutStore.canvasData.width;
  const canvasHeight = layoutStore.canvasData.height;

  const _file = new File([file.arrayBuffer], file.name, { type: file.fileType })
  const canvasItem = await parse(_file, { width: canvasWidth, height: canvasHeight });
  canvasItemsStore.addCanvasItem(canvasItem);
  actionHistoryStore.saveCanvasItemAction(canvasItem);

  // const canvasItemText = await parse('Text', {width: canvasWidth, height: canvasHeight});
  // canvasItemsStore.addCanvasItem(canvasItemText);
}

</script>

<template>
  <div :style="{cursor}">
    <div class="main-content">
      <div class="top-container">

        <div></div>

        <div class="player-hat">
          <label for="magnetise">Magnetise</label>
          <input id="magnetise" v-model="magnetise" type="checkbox"/>
        </div>

        <div></div>

        <div class="left-container">
          <Files @add-file-to-canvas="handleAddFileToCanvas" />
        </div>
        <div class="player-container">
          <Canvas v-model:cursor="cursor" ref="canvasComponent" />
        </div>
        <LayerPreviewContainer />
      </div>
      <div class="bottom-container">
        <LayersContainer />
        <TimeLineContainer />
      </div>
      <div>
        <Upload @upload="handleUpload" v-model="files" :allowed-types="['image/jpeg', 'image/png', 'image/gif']"/>
        <button @click="exportCanvasMP4">Download</button>
        <button @click="actionHistoryStore.moveBack">Back</button>
      </div>
    </div>
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

    .player-hat {
      height: 3rem;
      margin: 0 auto;
      width: 100%;
      border: 1px solid #555555;
    }
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
.left-container {
  width: 400px;
}
</style>
