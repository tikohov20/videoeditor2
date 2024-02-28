import { defineStore } from "pinia";
import { ref } from "vue";
import {CanvasItem, CanvasItems, TrackItem, TrackItems} from "../types.ts";

export const usePlayerElementsStore = defineStore('counter', () => {
    const trackItems = ref<TrackItems>([]);
    const canvasItems = ref<CanvasItems>([]);
    const timeStamp = ref(0);

    function addTrackItem(track: TrackItem) {
        trackItems.value.push(track);
    }

    function addCanvasItem(canvasItem: CanvasItem) {
        canvasItems.value.push(canvasItem);
    }

    function updateTimeStamp(newTimeStamp: number) {
        timeStamp.value = newTimeStamp;
    }

    return { trackItems, canvasItems, timeStamp, addTrackItem, addCanvasItem, updateTimeStamp }
})
