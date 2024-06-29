import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimeStore = defineStore('timeStore', () => {
    const timeStamp = ref(0);

    function updateTimeStamp(newTimeStamp: number) {
        timeStamp.value = newTimeStamp;
    }

    return {
        timeStamp,
        updateTimeStamp
    }
})