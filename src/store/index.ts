import { defineStore } from "pinia";
import { ref } from "vue";
import { CanvasItem, CanvasItems } from "../types.ts";
import { RemToMilliSeconds } from "../lib/shared/types.ts";
import { getTransformationMatrix, invertMatrix } from "../lib/shared/helpers.ts";

export const usePlayerElementsStore = defineStore('playerElements', () => {
    const canvasItems = ref<CanvasItems>([]);
    const timeStamp = ref(0);

    const activeElement = ref<CanvasItem | null>(null);

    function addCanvasItem(canvasItem: CanvasItem) {
        canvasItems.value.push(canvasItem);
    }

    function removeCanvasItem(canvasItemId: number) {
        canvasItems.value = canvasItems.value.filter(item => item.id !== canvasItemId)
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

    function resizeTrackItem(canvasItemId: number, start: number, duration: number): CanvasItem {
        const canvasItem = findCanvasItemById(canvasItemId);
        canvasItem.start = start * RemToMilliSeconds;
        canvasItem.duration = duration * RemToMilliSeconds;
        canvasItem.preview.id = Math.random();
        return canvasItem;
    }

    function moveCanvasItem(canvasItemId: number, offsetX: number, offsetY: number): CanvasItem {
        const canvasItem = findCanvasItemById(canvasItemId);

        if(canvasItem.matrix instanceof DOMMatrix) {
            canvasItem.matrix = getTransformationMatrix({
                x: offsetX,
                y: offsetY,
                scaleX: canvasItem.scaleX,
                scaleY: canvasItem.scaleY,
                rotation: {
                    angle: canvasItem.rotation,
                    x: canvasItem.width / 2,
                    y: canvasItem.height / 2
                }
            })
        }
        canvasItem.x = offsetX;
        canvasItem.y = offsetY;
        return canvasItem;
    }

    function updateCanvasItemLayout(canvasItemId: number, data: { x: number, y: number, width: number, height: number, rotation: number, opacity: number }) {
        const canvasItem = moveCanvasItem(canvasItemId, data.x, data.y);
        canvasItem.width = data.width;
        canvasItem.height = data.height;

        canvasItem.matrix = getTransformationMatrix({
            x: data.x,
            y: data.y,
            rotation: {
                angle: data.rotation,
                x: data.width / 2,
                y: data.height / 2
            },
            scaleX: data.width / canvasItem.initialWidth,
            scaleY: data.height / canvasItem.initialHeight
        });

        canvasItem.scaleX = data.width / canvasItem.initialWidth;
        canvasItem.scaleY = data.height / canvasItem.initialHeight;
        canvasItem.rotation = data.rotation;
        canvasItem.opacity = data.opacity;
    }

    function clickOnCanvas(x: number, y: number) {
        if (activeElement.value) {
            activeElement.value.isActive = false;
        }

        const clickedElement = findItemAtCoordinates(x, y);

        if (clickedElement) {
            activeElement.value = clickedElement;
            activeElement.value.isActive = true;
            return activeElement;
        }

        return null;
    }

    function findItemAtCoordinates(x: number, y: number) {
        // last element of array is on the top of the canvas
        let x1, y1 = 0;
        for (let i = canvasItems.value.length - 1; i >= 0; i--) {
            const item: CanvasItem = canvasItems.value[i];

            //TODO doesn't work lol
            //Change coordinate system
            const { a,b,c,d,e,f } = item.matrix.scale(1/item.scaleX, 1/item.scaleY)
            const centerX = item.x + item.width / 2;
            const centerY = item.y + item.height / 2;
            const localX = x - centerX;
            const localY = y - centerY;

            const matrix = [[a, c, e], [b, d, f], [0, 0, 1]];
            const inverse = invertMatrix(matrix);

            x1 = localX * inverse[0][0] + localY * inverse[0][1];
            y1 = localX * inverse[1][0] + localY * inverse[1][1];

            if (
                x1 >= -item.width / 2 &&
                x1 <= item.width / 2 &&
                y1 >= -item.height / 2 &&
                y1 <= item.height / 2
            ) {
                return item;
            }
        }
        return null;
    }

    function findCanvasItemById(id: number): CanvasItem {
        const canvasItem = canvasItems.value.find(canvasItem => canvasItem.id === id);
        if (!canvasItem) throw new Error('Item not found');
        return canvasItem;
    }

    return {
        canvasItems,
        timeStamp,
        activeElement,
        addCanvasItem,
        updateTimeStamp,
        clickOnCanvas,
        moveTrackItem,
        resizeTrackItem,
        moveCanvasItem,
        updateCanvasItemLayout,
        removeCanvasItem
    }
})
