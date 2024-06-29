import { defineStore } from "pinia";
import { CanvasItem } from "../types.ts";
import { getTransformationMatrix } from "../lib/shared/helpers.ts";

export const useCanvasItemsStore = defineStore('canvasItems', {
    state() {
        return {
            canvasItems: [] as Array<CanvasItem>,
        }
    },
    getters: {
        canvasItem: (state) => {
            return (id: number) => state.canvasItems.find(item => item.id === id);
        }
    },
    actions: {
        addCanvasItem(canvasItem: CanvasItem) {
            this.canvasItems.push(canvasItem);
        },
        removeCanvasItem(id: number) {
            this.canvasItems = this.canvasItems.filter(item => item.id !== id);
        },
        changeCanvasItemActive(id: number) {
            const canvasItem = this.canvasItem(id);
            if (!canvasItem) return;

            canvasItem.isActive = !canvasItem.isActive;

            return canvasItem;
        },
        updateCanvasItemProperties(
            id: number,
            properties: {
                coordinates?: { x: number, y: number },
                dimensions: { width: number, height: number },
                rotation?: number,
                opacity?: number
            }) {

            let canvasItem = null;

            if (properties.coordinates) {
                canvasItem = this.moveCanvasItem(id, properties.coordinates.x, properties.coordinates.y);
            } else {
                canvasItem = this.canvasItem(id);
            }

            if (!canvasItem) return;

            if (properties.dimensions) {
                canvasItem.width = properties.dimensions.width;
                canvasItem.height = properties.dimensions.height;
            }

            if (properties.rotation) {
                canvasItem.rotation = properties.rotation;
            }

            if (properties.opacity) {
                canvasItem.opacity = properties.opacity;
            }

            canvasItem.matrix = getTransformationMatrix({
                x: canvasItem.x,
                y: canvasItem.y,
                rotation: {
                    angle: canvasItem.rotation,
                    x: canvasItem.width / 2,
                    y: canvasItem.height / 2
                },
                scaleX: canvasItem.width / canvasItem.initialWidth,
                scaleY: canvasItem.height / canvasItem.initialHeight
            });

            canvasItem.scaleX = canvasItem.width / canvasItem.initialWidth;
            canvasItem.scaleY = canvasItem.height / canvasItem.initialHeight;

            return canvasItem;
        },
        moveCanvasItem(id: number, x: number, y: number) {
            const canvasItem = this.canvasItem(id);

            if (!canvasItem) return null;

            if(canvasItem.matrix instanceof DOMMatrix) {
                canvasItem.matrix = getTransformationMatrix({
                    x,
                    y,
                    scaleX: canvasItem.scaleX,
                    scaleY: canvasItem.scaleY,
                    rotation: {
                        angle: canvasItem.rotation,
                        x: canvasItem.width / 2,
                        y: canvasItem.height / 2
                    }
                })
            }

            canvasItem.x = x;
            canvasItem.y = y;

            return canvasItem as CanvasItem;
        }
    }
})