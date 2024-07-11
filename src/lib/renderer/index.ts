import {DefaultOpacity, RenderItem, RenderItems} from "../shared/types.ts";
import { getFrame } from "../parsers";
import { drawItemEditBox } from "./utils.ts";
import {handleKeyframes} from "../keyframes";
import { getTransformationMatrix } from "../shared/helpers.ts";
import { number } from "mathjs";

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
        if (renderItem.isHidden) continue;
        const itemFrame = getFrame(timeStamp, renderItem);
        if(!(itemFrame instanceof ImageBitmap)) continue;
        //TODO should we add a property to the item if it's visible or not ?
        /**
         * isVisible = true|false
         * will probably change this later, because I don't want this function to modify the state...
         */

        // TODO what does this do ??? describe first then remove ( optionally )
        if (!itemFrame) {
            renderItem.isVisible = false;
            renderItem.isActive = false;
            continue;
        }

        renderItem.isVisible = true;

        context.globalAlpha = renderItem.opacity;

        if (contextModifier) contextModifier(context, renderItem);

        let keyFrameMatrix = null;
        let keyFrameresult: any = {};
        if (renderItem.keyframes) {
            keyFrameresult = handleKeyframes(timeStamp, renderItem.keyframes);
            if (keyFrameresult) {
                // renderItem.x = number(result.x);
                // renderItem.y = number(result.y);
                // renderItem.width = number(result.width);
                // renderItem.height = number(result.height);
                keyFrameMatrix = getTransformationMatrix({
                    x: number(keyFrameresult.x),
                    y: number(keyFrameresult.y),
                    rotation: {
                        angle: renderItem.rotation,
                        x: renderItem.width / 2,
                        y: renderItem.height / 2
                    },
                    scaleX: number(keyFrameresult.width) / renderItem.initialWidth,
                    scaleY: number(keyFrameresult.height) / renderItem.initialHeight
                });
            }
        }
        context.setTransform(keyFrameMatrix || renderItem.matrix);

        // x: 0, y: 0 is top left corner, real x and y are controlled through the transformation matrix
        context.drawImage(itemFrame, 0, 0);
        context.globalAlpha = DefaultOpacity;
        context.resetTransform();

        if (drawTools && renderItem.isActive) {
            drawItemEditBox(context, {...renderItem, ...keyFrameresult})
        }
        context.resetTransform();
    }
}