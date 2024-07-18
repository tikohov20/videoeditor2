<script setup lang="ts">
import { computed, toRefs } from "vue";
import {CanvasItem} from "../../types.ts";
import Keyframes from "./Keyframes/Keyframes.vue";
import { useTimeStore } from "../../store/timeStore.ts";
import { useKeyFramesStore } from "@/store/canvas/canvasItems/keyFramesStore.ts";

interface Props {
  canvasItem: CanvasItem | null
}

const props = defineProps<Props>();
const emits = defineEmits(['input']);
const { canvasItem } = toRefs(props);
const timeStore = useTimeStore();

const keyFramesStore = useKeyFramesStore();

const isDisabled = computed(() => {
  return !!keyFramesStore.getKeyFrames(canvasItem.value?.id);
});

const keyFrames = computed(
    {
      get() {
        return keyFramesStore.getKeyFrames(canvasItem.value?.id);
      },
      set(e) {
        return keyFramesStore.setKeyFrames(canvasItem.value?.id, e);
      }
    }
);

const canvasItemLayout = computed(
    {
      get() {
        return {
          id: canvasItem.value?.id,
          coordinates: {
            x: canvasItem.value?.x,
            y: canvasItem.value?.y
          },
          dimensions: {
            width: canvasItem.value?.width,
            height: canvasItem.value?.height
          },
          rotation: canvasItem.value?.rotation,
          opacity: canvasItem.value?.opacity
        }
      },
      set(e) {
        emits('input', e);
      }
    }
);

function handleInput(name: string, e: HtmlInputEvent) {
  const path = name.split('.');

  if (path.length > 1) {
    canvasItemLayout.value = {
      ...canvasItemLayout.value,
      [path[0]]: {
        ...(canvasItemLayout.value[path[0] as keyof typeof canvasItemLayout.value] as any),
        [path[1]]: Number(e.target.value)
      }
    }
    return;
  }

  canvasItemLayout.value = {
    ...canvasItemLayout.value,
    [path[0]]: Number(e.target.value)
  }
}

function handleAddKeyframe(canvasItem: CanvasItem | null) {
  if (!canvasItem) return;

  if (!canvasItem.keyframes) {
    canvasItem.keyframes = {};
  }
  if(!canvasItem.keyframes[timeStore.timeStamp]) {
    canvasItem.keyframes[timeStore.timeStamp] = {
      x: canvasItem.x,
      y: canvasItem.y,
      width: canvasItem.width,
      height: canvasItem.height
    };
  }
}
</script>

<template>
  <div class="layer-preview">
    <div class="layer-template" v-if="canvasItem">
      <h2>Layout</h2>
      <div class="form-group">
        <div class="form-item">
          <label>
            Position X
          </label>
          <div>
            <input
                :disabled="isDisabled"
                class="input"
                type="number"
                :value="canvasItemLayout.coordinates.x"
                @input="handleInput('coordinates.x', $event as HtmlInputEvent)"
            />
          </div>
        </div>
        <div class="form-item">
          <label>
            Position Y
          </label>
          <div>
            <input
                :disabled="isDisabled"
                class="input"
                type="number"
                v-model="canvasItemLayout.coordinates.y"
                @input="handleInput('coordinates.y', $event as HtmlInputEvent)"
            />
          </div>
        </div>
        <div class="form-item">
          <label>
            Width
          </label>
          <div>
            <input
                :disabled="isDisabled"
                class="input"
                type="number"
                v-model="canvasItemLayout.dimensions.width"
                @input="handleInput('dimensions.width', $event as HtmlInputEvent)"

            />
          </div>
        </div>
        <div class="form-item">
          <label>
            Height
          </label>
          <div>
            <input
                :disabled="isDisabled"
                class="input"
                type="number"
                v-model="canvasItemLayout.dimensions.height"
                @input="handleInput('dimensions.height', $event as HtmlInputEvent)"
            />
          </div>
        </div>
        <div class="form-item">
          <label>
            Rotation
          </label>
          <div>
            <input
                :disabled="isDisabled"
                class="input"
                type="text"
                v-model="canvasItemLayout.rotation"
                @input="handleInput('rotation', $event as HtmlInputEvent)"
            />
          </div>
        </div>
        <div class="form-item">
          <label>
            Opacity
          </label>
          <div>
            <input
                :disabled="isDisabled"
                class="input"
                type="text"
                v-model="canvasItemLayout.opacity"
                @input="handleInput('opacity', $event as HtmlInputEvent)"
            />
          </div>
        </div>
        <div class="form-item keyframes-form-item">
          <div class="keyframes-hat">
            <label>
              Key Frames
            </label>
            <a v-if="canvasItem.keyframes" @click="canvasItem.keyframes = null">Delete</a>
          </div>
          <div>
            <Keyframes v-if="canvasItem.keyframes" v-model:key-frames="keyFrames" />
            <button @click="() => handleAddKeyframe(canvasItem)" class="add-keyframe-button">+ Keyframe</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layer-preview {
  padding: 1rem;
  width:100%;
  height: 100%;
}

.layer-template {
  h2 {
    font-size: 1rem;
    font-weight: 600;
  }
}

.form-group {
  display: grid;
  grid-template-columns: repeat(2, auto);
  row-gap: 1rem;
  column-gap: 1.5rem;
  .form-item {
    label {
      line-height: 2rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    &.keyframes-form-item {
      grid-column-start: 1;
      grid-column-end: 3;
    }
  }
}
.keyframes-hat {
  display: flex;
  justify-content: space-between;

  label, a {
    line-height: 2rem;
    font-size: 0.875rem;
  }

  a {
    color: #ff0000;
  }
}

.add-keyframe-button {
  margin-top: 1rem;
  padding: .5rem;

  &:hover {
    border-color: $blue;
  }
}
</style>