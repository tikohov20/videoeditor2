<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useCanvasUtilsStore } from "../../store/canvas/canvasUtilsStore.ts";
import { useActionHistoryStore } from "../../store/actionHistoryStore.ts";
import { useCanvasContextStore } from "../../store/canvas/canvasContextStore.ts";

const canvasUtilsStore = useCanvasUtilsStore();
const actionHistoryStore = useActionHistoryStore();
const canvasContextStore = useCanvasContextStore();

const emit = defineEmits(['render', 'update:cursor']);
const cursor = ref('initial');
const canvasElement = ref<HTMLCanvasElement | null>(null);
const canvasData = reactive({
  width: 1024,
  height: 576
});

watch(cursor, () => {
  emit('update:cursor', cursor.value)
})

onMounted(() => {
  if (!canvasElement.value) return; //TODO show error

  canvasContextStore.setup(canvasElement.value);
})

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

  emit('render');
}

function handleMouseUp(_event: MouseEvent) {
  cursor.value = 'initial';
  canvasUtilsStore.resetCanvasItemMouseMoveAction();
}

function handleMouseMove(event: MouseEvent) {
  canvasUtilsStore.canvasItemMouseMoveAction(event);
}

function handleMouseLeave(_event: MouseEvent) {
  cursor.value = 'initial';
}
</script>

<template>
  <canvas
    ref="canvasElement"
    :width="canvasData.width"
    :height="canvasData.height"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  />
</template>