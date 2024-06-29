import {DefaultOpacity, RenderItem, RenderItems} from "../shared/types.ts";
import { getFrame } from "../parsers";
import { drawItemEditBox } from "./utils.ts";
import {handleKeyframes} from "../keyframes";

export function renderTimestamp(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    timeStamp: number,
    renderItems: RenderItems,
    drawTools = true,
    contextModifier?: (context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, renderItem: RenderItem) => void
) {
    const { width, height } = canvas;

    // Always fresh canvas before rendering frame
    context.clearRect(0, 0, width, height);

    for (const renderItem of renderItems) {
        const itemFrame = getFrame(timeStamp, renderItem);

        //TODO should we add a property to the item if it's visible or not ?
        /**
         * isVisible = true|false
         * will probably change this later, because I don't want this function to modify the state...
         */
        if (!itemFrame) {
            renderItem.isVisible = false;
            renderItem.isActive = false;
            continue;
        }

        renderItem.isVisible = true;

        context.globalAlpha = renderItem.opacity;
        context.setTransform(renderItem.matrix);

        if (contextModifier) contextModifier(context, renderItem);

        // x: 0, y: 0 is top left corner, real x and y are controlled through the transformation matrix
        if (renderItem.keyframes) {
            const result = handleKeyframes(timeStamp, renderItem.keyframes);
            if (result) {
                renderItem.matrix.scaleSelf(1 / renderItem.scaleX, 1 / renderItem.scaleY);
                renderItem.matrix.scaleSelf(result.width / renderItem.initialWidth, result.height / renderItem.initialHeight);
                renderItem.scaleX = result.width / renderItem.initialWidth;
                renderItem.scaleY = result.height / renderItem.initialHeight;
                renderItem.matrix.translateSelf(-renderItem.x, 0);
                renderItem.matrix.translateSelf(result.x, 0);
                console.log(renderItem.x);
                console.log(result.x);
                renderItem.x = result.x;
            }
        }

        context.drawImage(itemFrame, 0, 0);
        context.globalAlpha = DefaultOpacity;
        context.resetTransform();

        if (drawTools && renderItem.isActive) {
            drawItemEditBox(context, renderItem)
        }
        context.resetTransform();
    }
}