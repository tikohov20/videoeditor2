<script setup lang="ts">

import { computed, ref } from "vue";

const emit = defineEmits(['dragStart', 'drag', 'dragEnd', 'update:offset']);
const dragging = ref(false);
// let skalatoneOffset = ref(0);

const props = defineProps({
  offset: {
    type: Number,
    default: 0
  },
  cursor: {
    required: false,
    default: 'initial'
  },
  cursorOnDrag: {
    required: false,
    default: true
  },
  dragStyles: {
    required: false,
    default: () => {
      return {}
    }
  },
  withSkalatone: {
    required: false,
    default: false
  },
  skalatoneBorder: {
    type: String,
    default: '1px solid #266dcd'
  }
});

const offsetCopy = ref(props.offset);

const computedStyles = computed(() => {
  let obj = {
    cursor: props.cursorOnDrag ? (dragging.value ? props.cursor : 'initial') : props.cursor,
  }

  if (dragging.value) {
    obj = {...props.dragStyles, ...obj}
  }

  return obj;
});

const skalatoneComputedStyles = computed(() => {
  return {
    border: dragging.value ? props.skalatoneBorder : '',
    transform: `translateX(${skalatoneOffset.value}px)`
  }
});

const skalatoneOffset = computed({
  get() {
    return offsetCopy.value;
  },
  set(e: number) {
    emit('update:offset', e);
    offsetCopy.value = e;
  }
})

function handleMouseDown(e: MouseEvent) {
  e.stopPropagation();
  dragging.value = true;
  window.addEventListener('mousemove', mousemove);
  window.addEventListener('mouseup', mouseup);
  emit('dragStart');

  let prevX = e.clientX;
  function mousemove (e: MouseEvent) {

    if(!props.withSkalatone) {
      const delta = e.clientX - prevX;
      prevX = e.clientX;

      emit('drag', delta);
    } else {
      const delta = e.clientX - prevX;
      prevX = e.clientX;

      skalatoneOffset.value += delta;
    }
  }
  function mouseup () {
    dragging.value = false;
    if(props.withSkalatone) {
      emit('drag', skalatoneOffset.value);
      emit('dragEnd');
      skalatoneOffset.value = 0;
    }
    window.removeEventListener('mousemove', mousemove);
    window.removeEventListener('mouseup', mouseup);
  }
}
</script>

<template>
  <div :style="computedStyles" @mousedown="handleMouseDown">
    <slot name="skalatone" :offset="skalatoneOffset">
      <div v-if="withSkalatone" :style="skalatoneComputedStyles" class="skalatone"></div>
    </slot>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.skalatone {
  height: 100%;
  width: 100%;
}
</style>