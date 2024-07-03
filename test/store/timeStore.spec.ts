import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useTimeStore } from "../../src/store/timeStore";

describe('Counter Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('increments', () => {
        const timeStore = useTimeStore()
        expect(timeStore.timeStamp).toBe(0)
        timeStore.incrementTimeStamp()
        expect(timeStore.timeStamp).toBe(1)
    })

    it('increments by amount', () => {
        const timeStore = useTimeStore()
        timeStore.incrementTimeStamp(10)
        expect(timeStore.timeStamp).toBe(10)
    })
})