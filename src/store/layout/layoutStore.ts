import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { CanvasItemId } from "@/types.ts";
import environment from "@/environment.ts";

export const useLayoutStore = defineStore('layoutStore', () => {
    const canvasData = reactive({
        width: environment.canvasDefaultWidth,
        height: environment.canvasDefaultHeight,
    })

    const layerTrackHeight = ref<{ [key: number]: number }>({});

    const getLayerTrackHeight = (id: CanvasItemId): number => {
        return layerTrackHeight.value[id];
    }
    const setLayerTrackHeight = (id: CanvasItemId, height: number) => {
        layerTrackHeight.value[id] = height;
    }

    return {
        layerTrackHeight,
        canvasData,

        getLayerTrackHeight,
        setLayerTrackHeight,
    }
})