import { describe, it, expect, beforeEach } from "vitest";

import { mount } from "@vue/test-utils"
import MediaTracks from "../../../src/components/MediaTracks/MediaTracks.vue";
import { useCanvasItemsStore } from "../../../src/store/canvasItemsStore";
import { createPinia, setActivePinia, storeToRefs } from "pinia";
import canvasItemsState from "../../states/state-2.json";
describe("MediaTracks", () => {
    beforeEach(() => {
        const pinia = createPinia();
        pinia.state.value = canvasItemsState;
        setActivePinia(pinia);
    });

    it('renders properly with empty props', async () => {
        const wrapper = mount(MediaTracks, {props: {tracks: [], canvasItems: []}});
        expect(wrapper.html()).to.contain("<div class=\"media-tracks\"></div>");
    });

    it('Renders properly with non empty props', async () => {
        const canvasItemsStore = useCanvasItemsStore();
        const { canvasItems} = canvasItemsStore;
        const wrapper = mount(MediaTracks, { props: {tracks: [], canvasItems: canvasItems}});
        expect(wrapper.html()).to.contain("class=\"media-track\"");
    });
})