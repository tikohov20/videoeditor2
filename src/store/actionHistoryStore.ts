import { defineStore, storeToRefs } from "pinia";
import { ref, toRaw } from "vue";
import { useCanvasItemsStore } from "./canvasItemsStore.ts";
import { CanvasItem } from "../types.ts";

enum ActionHistoryType {
    CANVAS_ITEM = "canvasItem",
}
interface ActionHistoryId {
    type: ActionHistoryType
    id: number
}
export const useActionHistoryStore = defineStore('actionHistory', () => {

    const canvasItemsStore = useCanvasItemsStore();
    const { canvasItems } = storeToRefs(canvasItemsStore)

    const historyIdArray = ref<ActionHistoryId[]>([]);
    const historyIdValuesMapping = ref<{ [key: number]: CanvasItem[] }>({});

    function saveCanvasItemAction(currentState: CanvasItem) {
        historyIdArray.value.push({ id: currentState.id, type: ActionHistoryType.CANVAS_ITEM });

        if(!Array.isArray(historyIdValuesMapping.value[currentState.id])) {
            historyIdValuesMapping.value[currentState.id] = [];
        }

        const clone = structuredClone(toRaw(currentState));

        historyIdValuesMapping.value[currentState.id].push(clone);
    }

    function moveBack() {
        const lastAction = historyIdArray.value.pop();

        if(!lastAction) return;

        const canvasItem = historyIdValuesMapping.value[lastAction.id].pop();

        if(!canvasItem) return;

        if (historyIdValuesMapping.value[lastAction.id].length  === 0) {
            canvasItems.value = canvasItems.value.filter(item => item.id !== canvasItem.id);
            return;
        }

        canvasItems.value = canvasItems.value.map(item => {
            if (item.id === canvasItem.id) {
                return canvasItem;
            }
            return item;
        })
    }

    return {
        historyIdArray,
        historyIdValuesMapping,
        saveCanvasItemAction,
        moveBack
    }
})