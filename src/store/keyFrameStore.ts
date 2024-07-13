import { defineStore } from "pinia";
import { ref } from "vue";
import { KeyFrames } from "../lib/shared/types.ts";
import { CanvasItemId } from "../types.ts";

interface CanvasKeyFrames {
    [key: CanvasItemId]: KeyFrames
}
export const useKeyFrameStore = defineStore('keyFrameStore', () => {
    const canvasKeyFrames = ref<CanvasKeyFrames>({});

    function setCanvasItemKeyFrames(id: CanvasItemId, keyFrames: KeyFrames) {
        canvasKeyFrames.value[id] = keyFrames;
    }

    function getCanvasItemKeyFrames(id: CanvasItemId): KeyFrames | undefined {
        return canvasKeyFrames.value[id];
    }

    return {
        canvasKeyFrames,

        setCanvasItemKeyFrames,
        getCanvasItemKeyFrames
    }
})