import { defineStore } from "pinia";
import { ref } from "vue";
import { CanvasItem, CanvasItems } from "../types.ts";
import {RemToMilliSeconds} from "../lib/shared/types.ts";

export const usePlayerElementsStore = defineStore('counter', () => {
    const canvasItems = ref<CanvasItems>([]);
    const timeStamp = ref(0);

    const activeElement = ref<CanvasItem | null>(null);

    function addCanvasItem(canvasItem: CanvasItem) {
        canvasItems.value.push(canvasItem);
    }

    function updateTimeStamp(newTimeStamp: number) {
        timeStamp.value = newTimeStamp;
    }

    function moveTrackItem(canvasItemId: number, offsetX: number): CanvasItem {
        const canvasItem = canvasItems.value.find(canvasItem => canvasItem.id === canvasItemId);
        if (!canvasItem) throw new Error('Item not found');

        canvasItem.preview.start = offsetX;
        canvasItem.preview.id = Math.random();
        canvasItem.start = offsetX * RemToMilliSeconds;
        return canvasItem;
    }

    function clickOnCanvas(x: number, y: number) {
        if(activeElement.value) {
            activeElement.value.isActive = false;
        }

        const clickedElement = findItemAtCoordinates(x, y);

        if (clickedElement) {
            activeElement.value = clickedElement;
            activeElement.value.isActive = true;
            return;
        }
    }

    function findItemAtCoordinates(x: number, y: number) {
        // last element of array is on the top of the canvas
        for (let i = canvasItems.value.length - 1; i >= 0; i--) {
            const item: CanvasItem = canvasItems.value[i];
            if (
                x >= item.x && x <= item.x + item.width &&
                y >= item.y && y <= item.y + item.height
            ) {
                return item;
            }
        }
        return null;
    }

    return { canvasItems, timeStamp, addCanvasItem, updateTimeStamp, clickOnCanvas, moveTrackItem }
})
