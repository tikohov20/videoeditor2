import { defineStore } from "pinia";
import { CanvasItem } from "../types.ts";
import { getTransformationMatrix } from "../lib/shared/helpers.ts";
import { parse } from "../lib/parsers";

export const useCanvasItemsStore = defineStore('canvasItems', {
    state() {
        return {
            canvasItems: [] as Array<CanvasItem>,
        }
    },
    async hydrate(storeState, initialState) {
        const media = import.meta.glob('../assets/*');
        storeState.canvasItems = await Promise.all(initialState.canvasItems.map(async item => {
            const mediaItem = await media[`../assets/${item.name}`]() as any;
            const mediaItemUrl = mediaItem.default;
            try {
                const resopnse = await fetch(mediaItemUrl);
                const contentType = resopnse.headers.get('content-type')
                const blob = await resopnse.blob();
                const file = new File([blob], item.name, { type: contentType ?? undefined  });
                const data = await parse(file, {width: 1024, height: 576});

                item.bitMap = data.bitMap;
                item.preview = data.preview;
                data.duration = item.duration;
                data.matrix = getTransformationMatrix({
                    x: item.x,
                    y: item.y,
                    rotation: {
                        angle: item.rotation,
                        x: item.width / 2,
                        y: item.height / 2
                    },
                    scaleX: item.width / item.initialWidth,
                    scaleY: item.height / item.initialHeight
                });
                data.x = item.x;
                data.y = item.y;
                return data;
            } catch (e) {
                item.bitMap = null;
                return item;
            }

        }));
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