import { defineStore } from "pinia";
import { ref, toRefs } from "vue";
import { useCanvasItemsStore } from "@/store/canvasItemsStore.ts";
import { CanvasItemId } from "@/types.ts";
import { KeyFrames } from "@/lib/shared/types.ts";

export const useKeyFramesStore = defineStore('canvas/canvasItems/keyFramesStore', () => {
    const canvasItemsStore = useCanvasItemsStore();
    const { canvasItems } = toRefs(canvasItemsStore);

    const keyFrames = ref<{
            [key: CanvasItemId]: KeyFrames
        }>({});

    function getKeyFrames(id?: CanvasItemId) {
        const canvasItem = canvasItems.value.find(item => item.id === id);

        if (canvasItem) {
            return canvasItem.keyframes
        }

        return null;
    }

    function setKeyFrames(id?: CanvasItemId, canvasItemKeyFrames?: KeyFrames) {
        const canvasItem = canvasItems.value.find(item => item.id === id);

        if (canvasItem && id && canvasItemKeyFrames) {
            keyFrames.value[id] = canvasItemKeyFrames;
            return canvasItem.keyframes = canvasItemKeyFrames;
        }

        return null;
    }

    return {
        keyFrames,

        getKeyFrames,
        setKeyFrames
    }
})