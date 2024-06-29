import { defineStore, storeToRefs } from "pinia";
import { useCanvasItemsStore } from "./canvasItemsStore.ts";
import { Ref, ref } from "vue";
import { CanvasItem, CanvasItemAction } from "../types.ts";
import { invertMatrix } from "../lib/shared/helpers.ts";
import { RemToMilliSeconds } from "../lib/shared/types.ts";

export const useCanvasUtilsStore = defineStore('canvasUtilsStore', () => {
    const canvasItemsStore = useCanvasItemsStore();
    const { canvasItems} = storeToRefs(canvasItemsStore);
    const activeItem = ref<CanvasItem | null>(null);

    const canvasItemMouseMoveData = ref(getDefaultCanvasItemMouseMoveData());

    function getDefaultCanvasItemMouseMoveData() {
        return {
            isResizing: false,
            canvasItem: null as CanvasItem | null,
            initialMouseX: 0,
            initialMouseY: 0,
            initialX: 0,
            initialY: 0,
            initialWidth: 0,
            initialHeight: 0,
            actionType: CanvasItemAction.DRAG
        }
    }

    function clickOnCanvas(x: number, y: number): { clickedItem: Ref<CanvasItem | null>, actionType: CanvasItemAction, cursor: string } {
        let actionType = CanvasItemAction.DRAG;
        let clickedElement = null;

        if (activeItem.value !== null) {
            //Probably should store the id of active element and not store that the element is active in the element itself ( so we can avoid potential double active elements )
            activeItem.value.isActive = false;
            actionType = getActionType(activeItem.value, x, y);
            if (actionType !== CanvasItemAction.DRAG) {
                activeItem.value.isActive = true;
                return { clickedItem: activeItem, actionType, cursor: getCursorFromActionType(actionType) }
            }
        }
        clickedElement = findItemAtCoordinates(x, y);

        if (!clickedElement) {
            activeItem.value = null;
            return { clickedItem: activeItem, actionType, cursor: getCursorFromActionType(actionType) };
        }

        activeItem.value = clickedElement;
        activeItem.value.isActive = true;

        return { clickedItem: activeItem, actionType, cursor: getCursorFromActionType(actionType) };
    }

    function findItemAtCoordinates(x: number, y: number) {
        // last element of array is on the top of the canvas
        let x1, y1 = 0;
        for (let i = canvasItems.value.length - 1; i >= 0; i--) {
            const item: CanvasItem = canvasItems.value[i];

            if (!item.isVisible) continue;

            //TODO doesn't work lol ( next time explain what doesn't work you dummy... )
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

    function getActionType(canvasItem: CanvasItem, x: number, y: number) {
        if (canvasItem.x - 6 < x && canvasItem.y - 6 < y && canvasItem.x + 6 > x && canvasItem.y + 6 > y) {
            return CanvasItemAction.RESIZE_TOP_LEFT;
        }

        if (canvasItem.x - 6 < x && canvasItem.y + canvasItem.height - 6 < y && canvasItem.x + 6 > x && canvasItem.y + canvasItem.height + 6 > y) {
            return CanvasItemAction.RESIZE_BOTTOM_LEFT;
        }

        if (canvasItem.x + canvasItem.width - 6 < x && canvasItem.y + canvasItem.height - 6 < y && canvasItem.x + canvasItem.width + 6 > x && canvasItem.y + canvasItem.height + 6 > y) {
            return CanvasItemAction.RESIZE_BOTTOM_RIGHT;
        }

        if (canvasItem.x + canvasItem.width - 6 < x && canvasItem.y - 6 < y && canvasItem.x + canvasItem.width + 6 > x && canvasItem.y + 6 > y) {
            return CanvasItemAction.RESIZE_TOP_RIGHT;
        }

        return CanvasItemAction.DRAG;
    }

    function initCanvasItemMouseMoveAction(
        movingItem: CanvasItem,
        initialX: number,
        initialY: number,
        initialMouseX: number,
        initialMouseY: number,
        actionType: CanvasItemAction,

    ) {
        canvasItemMouseMoveData.value.canvasItem = movingItem;
        canvasItemMouseMoveData.value.initialX = initialX;
        canvasItemMouseMoveData.value.initialY = initialY;
        canvasItemMouseMoveData.value.initialMouseX = initialMouseX;
        canvasItemMouseMoveData.value.initialMouseY = initialMouseY;
        canvasItemMouseMoveData.value.actionType = actionType;

        if (actionType !== CanvasItemAction.DRAG) {
            canvasItemMouseMoveData.value.isResizing = true;
            canvasItemMouseMoveData.value.initialWidth = movingItem.width;
            canvasItemMouseMoveData.value.initialHeight = movingItem.height;
        }
    }
    function canvasItemMouseMoveAction(event: MouseEvent) {
        const {
            isResizing,
            canvasItem,
            initialX,
            initialY,
            initialMouseY,
            initialMouseX,
            initialWidth,
            initialHeight,
            actionType
        } = canvasItemMouseMoveData.value;

        if ( !canvasItem ) return;

        const { offsetX, offsetY } = event;

        if (isResizing) {
            const coordinates = {} as any;
            const dimensions = {} as any;

            switch (actionType) {
                case CanvasItemAction.RESIZE_TOP_LEFT:
                    coordinates.x = initialX + offsetX - initialMouseX;
                    coordinates.y = initialY + offsetY - initialMouseY;
                    dimensions.width = initialWidth - offsetX + initialMouseX;
                    dimensions.height = initialHeight - offsetY + initialMouseY;
                    break;
                case CanvasItemAction.RESIZE_BOTTOM_LEFT:
                    coordinates.x = initialX + offsetX - initialMouseX;
                    coordinates.y = initialY;
                    dimensions.width = initialWidth - offsetX + initialMouseX;
                    dimensions.height = initialHeight + offsetY - initialMouseY;
                    break;
                case CanvasItemAction.RESIZE_BOTTOM_RIGHT:
                    coordinates.x = initialX;
                    coordinates.y = initialY;
                    dimensions.width = initialWidth + offsetX - initialMouseX;
                    dimensions.height = initialHeight + offsetY - initialMouseY;
                    break;
                case CanvasItemAction.RESIZE_TOP_RIGHT:
                    coordinates.x = initialX;
                    coordinates.y = initialY + offsetY - initialMouseY;
                    dimensions.width = initialWidth + offsetX - initialMouseX;
                    dimensions.height = initialHeight - offsetY + initialMouseY;
                    break;
            }
            canvasItemsStore.updateCanvasItemProperties(canvasItem.id, {
                coordinates,
                dimensions,
                rotation: canvasItem.rotation,
                opacity: canvasItem.opacity
            });
            return;
        }

        canvasItemsStore.moveCanvasItem(canvasItem.id, initialX + offsetX - initialMouseX, initialY + offsetY - initialMouseY)
    }

    function resetCanvasItemMouseMoveAction() {
        canvasItemMouseMoveData.value = getDefaultCanvasItemMouseMoveData();
    }



    function moveTrackItem(id: number, offsetX: number): CanvasItem {
        const canvasItem = canvasItemsStore.canvasItem(id)
        if (!canvasItem) throw new Error('Item not found');

        canvasItem.preview.start = offsetX;
        canvasItem.preview.id = Math.random();
        canvasItem.start = offsetX * RemToMilliSeconds;
        return canvasItem;
    }

    function resizeTrackItem(id: number, start: number, duration: number): CanvasItem {
        const canvasItem = canvasItemsStore.canvasItem(id);

        if (!canvasItem) throw new Error('Item not found');

        canvasItem.start = start * RemToMilliSeconds;
        canvasItem.duration = duration * RemToMilliSeconds;
        canvasItem.preview.id = Math.random();
        return canvasItem;
    }

    function getCursorFromActionType(actionType: CanvasItemAction) {
        switch (actionType) {
            case CanvasItemAction.RESIZE_TOP_LEFT:
            case CanvasItemAction.RESIZE_BOTTOM_RIGHT:
                return 'nwse-resize';
            case CanvasItemAction.RESIZE_BOTTOM_LEFT:
            case CanvasItemAction.RESIZE_TOP_RIGHT:
                return 'nesw-resize';
            case CanvasItemAction.DRAG:
                return 'grab';
            default:
                return 'initial';
        }
    }

    return {
        clickOnCanvas,
        activeItem,
        canvasItemMouseMoveAction,
        resetCanvasItemMouseMoveAction,
        initCanvasItemMouseMoveAction,
        moveTrackItem,
        resizeTrackItem
    }
})