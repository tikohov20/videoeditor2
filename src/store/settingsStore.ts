import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore('settingsStore', () => {
    const magnetise = ref(true);

    return {
        magnetise
    }
})