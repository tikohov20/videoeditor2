import { defineStore } from "pinia";
import { CanvasItem, CanvasItemId } from "../types.ts";
import { getTransformationMatrix } from "../lib/shared/helpers.ts";
import { parse } from "../lib/parsers";
import { isNumber } from "mathjs";
import { RenderItemTypes } from "@/lib/shared/types.ts";

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
                const response = await fetch(mediaItemUrl);
                const contentType = response.headers.get('content-type')
                const blob = await response.blob();
                const file = new File([blob], item.name, { type: contentType ?? undefined  });
                const data = await parse(file, {width: 1024, height: 576});

                item.bitMap = data.bitMap;
                item.preview = data.preview;
                item.matrix = getTransformationMatrix({
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

                item.preview.renderItemId = item.id;
                // data.duration = item.duration;
                // data.matrix = getTransformationMatrix({
                //     x: item.x,
                //     y: item.y,
                //     rotation: {
                //         angle: item.rotation,
                //         x: item.width / 2,
                //         y: item.height / 2
                //     },
                //     scaleX: item.width / item.initialWidth,
                //     scaleY: item.height / item.initialHeight
                // });
                // data.x = item.x;
                // data.y = item.y;
                return item;
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
        hideCanvasItem(id: number) {
            let localCanvasItem = this.canvasItems.find(item => item.id === id);
            localCanvasItem && (localCanvasItem.isHidden = !localCanvasItem.isHidden);
        },
        changeCanvasItemActive(id: number) {
            const canvasItem = this.canvasItem(id);
            if (!canvasItem) return;

            canvasItem.isActive = !canvasItem.isActive;

            return canvasItem;
        },
        updateCanvasItemName(id: CanvasItemId, name?: string) {
            const canvasItem = this.canvasItem(id);
            if (!canvasItem) return;

            if (name) {
                canvasItem.name = name;
            }
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

            if (isNumber(properties.rotation)) {
                canvasItem.rotation = properties.rotation;
            }

            if (isNumber(properties.opacity)) {
                canvasItem.opacity = properties.opacity;
            }
            let scaleX = canvasItem.width / canvasItem.initialWidth;
            let scaleY = canvasItem.height / canvasItem.initialHeight;

            if (canvasItem.itemType === RenderItemTypes.TEXT) {
                scaleX = 1;
                scaleY = 1;
            }

            canvasItem.matrix = getTransformationMatrix({
                x: canvasItem.x,
                y: canvasItem.y,
                rotation: {
                    angle: canvasItem.rotation,
                    x: canvasItem.width / 2,
                    y: canvasItem.height / 2
                },
                scaleX,
                scaleY
            });

            canvasItem.scaleX = scaleX;
            canvasItem.scaleY = scaleY;
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
        },
        addOrRemoveKeyFrameToCanvasItem(id: number, timeStamp: number) {
            const canvasItem = this.canvasItem(id);

            if(!canvasItem) return;

            if (!canvasItem.keyframes) {
                canvasItem.keyframes = {};
            }

            if(!canvasItem.keyframes[timeStamp]) {
                canvasItem.keyframes[timeStamp] = {
                    x: canvasItem.x,
                    y: canvasItem.y,
                    width: canvasItem.width,
                    height: canvasItem.height,
                    opacity: canvasItem.opacity,
                    rotation: canvasItem.rotation
                };

                if(!canvasItem.keyframes[0]) {
                    canvasItem.keyframes[0] = { ...canvasItem.keyframes[timeStamp] }
                }
            } else {
                delete canvasItem.keyframes[timeStamp];
            }

            if(!Object.keys(canvasItem.keyframes).length) {
                canvasItem.keyframes = null;
            }
        }
    }
})