<script setup lang="ts">

import { KeyFrames } from "../../../lib/shared/types.ts";
import { computed } from "vue";
import { number } from "mathjs";

interface Props {
  keyFrames: KeyFrames
}

interface ComputedKeyFrame extends Keyframe {
  time: number
}

const props = defineProps<Props>();
const emit = defineEmits(['update:keyFrames']);

const computedKeyframes = computed(() => {
  return Object.entries(props.keyFrames).map(entry => {
    return {
      ...entry[1],
      time: number(entry[0])
    }
  });
});

function handleInput(e: HtmlInputEvent, keyframe: any, path: string) {
  let value: number;

  try {
    value = number(e.target.value);
  } catch(error) {
    value = 0;
  }

  keyframe[path] = value;

  const key = keyframe.time;

  const arg = {
    ...props.keyFrames,
    [key]: {
      x: keyframe.x,
      y: keyframe.y,
      width: keyframe.width,
      height: keyframe.height
    }
  }

  emit('update:keyFrames', arg);
}

function handleDelete(keyframe: ComputedKeyFrame) {
  const keyframes = Object.keys(props.keyFrames).reduce((previousValue, currentValue) => {
    const key = number(currentValue);

    if (key === keyframe.time) return previousValue;
    previousValue[key] = props.keyFrames[key];

    return previousValue;
  }, {} as {[key: string]: any});

  if (Object.keys(keyframes).length < 1) return emit('update:keyFrames', null);
  emit('update:keyFrames', keyframes);
}
</script>

<template>
  <div class="keyframes">
    <div class="keyframe" v-for="keyframe in computedKeyframes">
      <div class="keyframe-hat">
        <label>Second {{ keyframe.time / 1000 }}</label>
        <a @click="() => handleDelete(keyframe)">Delete</a>
      </div>
      <div class="keyframe-container">
        <div>
          <label>Position X</label>
          <input class="input" :value="keyframe.x" @input="e => handleInput(e as HtmlInputEvent, keyframe, 'x')">
        </div>
        <div>
          <label>Position Y</label>
          <input class="input" :value="keyframe.y" @input="e => handleInput(e as HtmlInputEvent, keyframe, 'y')">
        </div>
        <div>
          <label>Width</label>
          <input class="input" :value="keyframe.width" @input="e => handleInput(e as HtmlInputEvent, keyframe, 'width')">
        </div>
        <div>
          <label>Height</label>
          <input class="input" :value="keyframe.height" @input="e => handleInput(e as HtmlInputEvent, keyframe, 'height')">
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keyframes {
  max-height: 200px;
  overflow-y: scroll;
  border: 1px solid #555555;
  padding: 0 .5rem;

  .keyframe {
    .keyframe-hat {
      display: flex;
      justify-content: space-between;
      label, a {
        display: inline-block;
        line-height: 2rem;
        font-size: 0.875rem;
      }

      a {
        color: $danger;
      }
    }
  }
}


.keyframe-container {
  display: grid;
  grid-template-columns: repeat(2, auto);
  column-gap: 1.5rem;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  input {
    margin-bottom: 1rem;
  }
}
</style>