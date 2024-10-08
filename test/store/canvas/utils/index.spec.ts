import { describe, it, expect, beforeEach } from "vitest";

import { createPinia, setActivePinia, storeToRefs } from "pinia";
import canvasItemsState from "../../../states/state-2.json";
import { useCanvasItemsStore } from "../../../../src/store/canvasItemsStore";
import { stickCanvasItemToImportantPositions } from "../../../../src/store/canvas/utils";
describe("Canvas Store Utils", () => {
    describe("stickCanvasItemToImportantPositions canvas points", () => {
        beforeEach(() => {
            const pinia = createPinia();
            pinia.state.value = canvasItemsState;
            setActivePinia(pinia);
        });

        it('Canvas Item Sticks to the Left', async () => {
            const canvasItemsStore = useCanvasItemsStore();
            const { canvasItems} = canvasItemsStore;

            const [x ,y] = stickCanvasItemToImportantPositions(4, 30, canvasItems[1], canvasItems);

            expect(x).to.eql(0);
            expect(y).to.eql(30);
        });

        it('Canvas Item Sticks to the Right', async () => {
            const canvasItemsStore = useCanvasItemsStore();
            const { canvasItems} = canvasItemsStore;

            const [x ,y] = stickCanvasItemToImportantPositions(1024 - canvasItems[1].width + 5, 30, canvasItems[1], canvasItems);

            expect(x).to.eql(1024 - canvasItems[1].width);
            expect(y).to.eql(30);
        });

        it('Canvas Item Sticks to the Bottom', async () => {
            const canvasItemsStore = useCanvasItemsStore();
            const { canvasItems} = canvasItemsStore;

            const [x ,y] = stickCanvasItemToImportantPositions(30, 5, canvasItems[1], canvasItems);

            expect(x).to.eql(30);
            expect(y).to.eql(0);
        });

        it('Canvas Item Sticks to the Center', async () => {
            const canvasItemsStore = useCanvasItemsStore();
            const { canvasItems} = canvasItemsStore;

            const [x ,y] = stickCanvasItemToImportantPositions(1024/2 - canvasItems[1].width / 2 + 5, 576 / 2 - canvasItems[1].height / 2 + 5, canvasItems[1], canvasItems);

            expect(x).to.eql(1024/2 - canvasItems[1].width / 2);
            expect(y).to.eql(576 / 2 - canvasItems[1].height / 2);
        });
    });
    describe("stickCanvasItemToImportantPositions canvasItems points", () => {
        beforeEach(() => {
            const pinia = createPinia();
            pinia.state.value = canvasItemsState;
            setActivePinia(pinia);
        });

        it('Canvas Item Sticks to nearby Canvas Item from left', async () => {
            const canvasItemsStore = useCanvasItemsStore();
            const { canvasItems} = canvasItemsStore;

            canvasItems[0].x = 250;
            canvasItems[0].y = 250;
            const [x ,y] = stickCanvasItemToImportantPositions(245, 245, canvasItems[1], canvasItems);

            expect(x).to.eql(250);
            expect(y).to.eql(250);
        });

        it('Canvas Item Sticks to nearby Canvas Item from right', async () => {
            const canvasItemsStore = useCanvasItemsStore();
            const { canvasItems} = canvasItemsStore;

            canvasItems[0].x = 250;
            canvasItems[0].y = 250;
            const [x ,y] = stickCanvasItemToImportantPositions(255 + canvasItems[0].width, 255 + canvasItems[0].height, canvasItems[1], canvasItems);

            expect(x).to.eql(250 + canvasItems[0].width);
            expect(y).to.eql(250 + canvasItems[0].height);
        });
    });

})