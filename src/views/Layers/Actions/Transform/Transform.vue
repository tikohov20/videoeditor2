<script setup lang="ts">
import { CanvasItem } from "@/types.ts";
import { useCanvasItemsStore } from "@/store/canvasItemsStore.ts";
import { number } from "mathjs";
import { useTimeStore } from "@/store/timeStore.ts";
import { computed } from "vue";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faClock as faClockSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

interface Props {
  layer: CanvasItem
}
const canvasItemsStore = useCanvasItemsStore();
const timeStore = useTimeStore();

const props = defineProps<Props>();
const { layer } = props;

const disabled = computed(() => {
  if(!layer.keyframes) return false;

  return !layer.keyframes[timeStore.timeStamp];
})

function handleInput(e: HtmlInputEvent, key: keyof typeof layer) {
  let value;
  try {
    value = number(e.target.value);
  } catch(error) {
    value = 0;
  }

  if (layer.keyframes) {
    if(layer.keyframes[timeStore.timeStamp]) {
      // @ts-ignore
      layer.keyframes[timeStore.timeStamp][key] = value;
    }
    return;
  }

  const dimensions = {
    width: layer.width,
    height: layer.height
  }
  const coordinates = {
    x: layer.x,
    y: layer.y
  }

  let rotation = layer.rotation;
  let opacity = layer.opacity;

  if (key === 'x' || key === 'y') {
    coordinates[key] = value;
  }

  if (key === 'width' || key === 'height') {
    dimensions[key] = value;
  }

  if (key === 'rotation') {
    rotation = value;
  }

  if (key === 'opacity') {
    opacity = value;
  }

  canvasItemsStore.updateCanvasItemProperties(layer.id, { coordinates, dimensions, rotation, opacity })
}

function addOrRemoveKeyframe() {
  if (!layer) return;

  canvasItemsStore.addOrRemoveKeyFrameToCanvasItem(layer.id, timeStore.timeStamp)
}
</script>

<template>
  <div class="layer-action-transform">
    <div class="layer-action-transform-actions">
      <a class="icon" @click="addOrRemoveKeyframe">
        <FontAwesomeIcon :icon="faClock" />
      </a>
      <div>
        <label>Position X</label>
        <input class="input" :disabled="disabled" :value="layer.x" @input="e => handleInput(e as HtmlInputEvent, 'x')" type="text" />
      </div>
      <div>
        <label>Position Y</label>
        <input class="input" :disabled="disabled" :value="layer.y" @input="e => handleInput(e as HtmlInputEvent, 'y')" type="text" />
      </div>
      <div></div>
      <div>
        <label>Width</label>
        <input class="input" :disabled="disabled" :value="layer.width" @input="e => handleInput(e as HtmlInputEvent, 'width')" type="text" />
      </div>
      <div>
        <label>Height</label>
        <input class="input" :disabled="disabled" :value="layer.height" @input="e => handleInput(e as HtmlInputEvent, 'height')" type="text" />
      </div>
      <div></div>
      <div>
        <label>Rotation</label>
        <input class="input" :disabled="disabled" :value="layer.rotation" @input="e => handleInput(e as HtmlInputEvent, 'rotation')" type="text" />
      </div>
      <div></div>
      <div></div>
      <div>
        <label>Opacity</label>
        <input class="input" :disabled="disabled" :value="layer.opacity" @input="e => handleInput(e as HtmlInputEvent, 'opacity')" type="text" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layer-action-transform-actions {
  display: grid;
  grid-template-columns: 1rem auto auto;
  grid-column-gap: .5rem;
  //row-gap: 1rem;
  //column-gap: 1.5rem;

  .icon {
    color: $color-primary-dark;
    margin-top: auto;
    padding-bottom: 0.2rem;
  }

  > div {
    width: 100%;
    height: $timelineLayerHeight;
    label {
      line-height: 1.1rem;
      font-size: 0.75rem;
      display: block;
    }

    input {
      padding: .25rem;
      //margin-top: .25rem;
    }
  }
}
</style>