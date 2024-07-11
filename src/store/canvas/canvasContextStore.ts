import { defineStore, storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { Canvas } from "canvas";
import { renderTimestamp } from "../../lib/renderer";
import { useTimeStore } from "../timeStore.ts";
import { useCanvasItemsStore } from "../canvasItemsStore.ts";

export const useCanvasContextStore = defineStore('canvas/canvasContextStore', () => {
    const timeStore = useTimeStore();
    const canvasItemsStore = useCanvasItemsStore();
    const allowRendering = ref(true);
    const { timeStamp} = storeToRefs(timeStore);
    const { canvasItems } = storeToRefs(canvasItemsStore);

    const canvas = ref<HTMLCanvasElement | null>(null);
    const context = ref<CanvasRenderingContext2D | null>(null);

    const offscreenCanvasHtml = window.OffscreenCanvas ? new OffscreenCanvas(1, 1) : (new Canvas(1, 1) as any); //idk walt TODO
    const offscreenCanvas = ref<OffscreenCanvas | HTMLCanvasElement>(
        offscreenCanvasHtml
    );
    const offscreenCanvasContext = ref<OffscreenCanvasRenderingContext2D>(offscreenCanvasHtml.getContext("2d", {
        desynchronized: true,
        willReadFrequently: true
    }))

    function setup(htmlCanvas: HTMLCanvasElement) {
        canvas.value = htmlCanvas;
        context.value = htmlCanvas.getContext("2d", {
            desynchronized: true,
            willReadFrequently: true
        });
    }

    function renderCanvas() {
        if (!canvas.value || !context.value) return

        allowRendering && renderTimestamp(canvas.value, context.value, timeStore.timeStamp, canvasItemsStore.canvasItems);
    }

    function initRenderWatchers() {
        watch(timeStamp, () => {
            renderCanvas();
        });


        watch(canvasItems, () => {
            renderCanvas();
        }, {
            deep: true
        })
    }

    return {
        canvas,
        context,
        offscreenCanvas,
        offscreenCanvasContext,
        allowRendering,

        setup,
        renderCanvas,
        initRenderWatchers
    }
})