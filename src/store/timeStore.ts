import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimeStore = defineStore('timeStore', () => {
    const timeStamp = ref(0);

    function incrementTimeStamp(newTimeStamp: number = 1) {
        timeStamp.value = newTimeStamp;
    }

    return {
        timeStamp,
        incrementTimeStamp
    }
})