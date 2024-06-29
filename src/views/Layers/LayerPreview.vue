<script setup lang="ts">
import { computed, toRefs } from "vue";
import {CanvasItem} from "../../types.ts";

interface Props {
  canvasItem: CanvasItem | null
}

const props = defineProps<Props>();
const emits = defineEmits(['input']);
const { canvasItem } = toRefs(props);

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
                class="input"
                type="text"
                v-model="canvasItemLayout.opacity"
                @input="handleInput('opacity', $event as HtmlInputEvent)"
            />
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
  grid-template-columns: auto auto;
  row-gap: 1rem;
  column-gap: 1.5rem;
  .form-item {
    label {
      line-height: 2rem;
      font-size: 0.875rem;
      font-weight: 500;
    }
  }
}
</style>