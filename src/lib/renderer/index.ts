import { RenderItems } from "../shared/types.ts";
import { getFrame } from "../parsers";
import { drawItemEditBox } from "./utils.ts";

export function renderTimestamp(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, timeStamp: number, renderItems: RenderItems) {
    const { width, height } = canvas;
    context.clearRect(0, 0, width, height);

    for(const renderItem of renderItems) {
        const itemFrame = getFrame(timeStamp, renderItem);
        if (!itemFrame) continue;

        if(renderItem.matrix) {
            context.setTransform(...(renderItem.matrix as any))
        }

        // x: 0, y: 0 is top left corner
        context.drawImage(itemFrame, renderItem.x, renderItem.y);

        if (renderItem.isActive) {
            drawItemEditBox(context, renderItem)
        }
        context.resetTransform();
    }
}