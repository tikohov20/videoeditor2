import { RenderItems } from "../shared/types.ts";
import { getFrame } from "../parsers";

export function renderTimestamp(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, timeStamp: number, renderItems: RenderItems) {
    const { width, height } = canvas;
    context.clearRect(0, 0, width, height);

    for(const renderItem of renderItems) {
        const itemFrame = getFrame(timeStamp, renderItem);
        if(!itemFrame) continue;

        context.drawImage(itemFrame, renderItem.x, renderItem.y);
    }
}