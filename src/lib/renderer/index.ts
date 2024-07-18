import { DefaultOpacity, RenderItem, RenderItems, RenderItemText, RenderItemTypes } from "../shared/types.ts";
import { getFrame } from "../parsers";
import { drawItemEditBox } from "./utils.ts";
import { handleKeyframes } from "../keyframes";
import { getTransformationMatrix } from "../shared/helpers.ts";
import { number } from "mathjs";
import { timestamp } from "@vueuse/core";

export function renderTimestamp(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    timeStamp: number,
    renderItems: RenderItems,
    drawTools = true,
    contextModifier?: (context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, renderItem: RenderItem) => void
) {
    // @ts-ignore
    const { width, height } = canvas;

    // Always fresh canvas before rendering frame
    context.reset();

    for (const renderItem of renderItems) {
        if (renderItem.isHidden) continue;

        if(renderItem.itemType === RenderItemTypes.TEXT) {
            renderText(renderItem as RenderItemText, timeStamp, context);
            continue;
        }
        const itemFrame = getFrame(timeStamp, renderItem) as ImageBitmap | null;
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

function renderText(renderItem: RenderItemText, timeStamp: number, context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, drawTools: boolean = true) {
    renderItem.isVisible = true;
    const frame = getFrame(timeStamp, renderItem) as string
    if(!frame) return;

    context.setTransform(renderItem.matrix);
    context.font = renderItem.textData.font;
    context.strokeStyle = renderItem.textData.strokeStyle;
    context.fillStyle = renderItem.textData.fillStyle;
    context.lineWidth = renderItem.textData.lineWidth;

    // Why 0.8 ? I have no clue...
    const lineHeight = 0.8 * renderItem.textData.fontSize;

    printAt(context, renderItem.textData.text, 0, 0.8 * renderItem.textData.fontSize, 0.8 * renderItem.textData.fontSize, renderItem.width)
    // context.fillRect(0, 0, 50, 50);
    // context.clearRect(45, 45, 60, 60);
    // context.strokeRect(50, 50, 50, 50);
    // renderItem.textData.text.split('\n').forEach((item, index) => {
    //     context.fillText(item, 0, 50 - 15 + index * lineHeight);
    //     context.strokeText(item, 0, 50 - 15 + index * lineHeight);
    // })

    context.resetTransform();

    // context.clearRect(0, 0, 1024, 500);

    if (drawTools && renderItem.isActive) {
        drawItemEditBox(context, renderItem)
    }
}

function printAt( context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D , text: string, x: number, y: number, lineHeight: number, fitWidth: number)
{
    fitWidth = fitWidth || 0;

    if (fitWidth <= 0)
    {
        context.fillText( text, x, y );
        return;
    }

    // for (let i = 1; i < text.length ; i++) {
    //     context.fill
    // }

    for (let idx = 1; idx <= text.length; idx++)
    {
        let str = text.substring(0, idx);

        if (context.measureText(str).width > fitWidth)
        {
            if(str.length !== 1) {
                context.fillText( text.substring(0, idx-1), x, y );
                printAt(context, text.substring(idx-1).trim(), x, y + lineHeight, lineHeight,  fitWidth);
            }
            return;
        }
    }
    context.fillText( text, x, y );
}
