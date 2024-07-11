import {RenderItem} from "../shared/types.ts";

// TODO make configurable
export function drawItemEditBox(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, renderItem: RenderItem) {
    //Move to item corner
    context.beginPath();
    context.strokeStyle = "#8494b9";
    context.fillStyle = "#8494b9";
    context.lineWidth = 2;

    context.translate(renderItem.x, renderItem.y);

    // context.rect(-1,  -1, renderItem.width + 1, renderItem.height + 1);
    // context.stroke();
    // context.rect(- 6, -6, 12, 12);
    // context.stroke();
    // context.rect(- 6 + renderItem.width, -6, 12, 12);
    // context.stroke();
    // context.rect(- 6 + renderItem.width, -6 + renderItem.height, 12, 12);
    // context.stroke();
    // context.rect(- 6, -6 + renderItem.height, 12, 12);
    // context.stroke();

    if (renderItem.rotation) {
        context.translate(renderItem.width * 0.5, renderItem.height * 0.5);
        context.rotate(renderItem.rotation * Math.PI / 180);
        context.translate(-renderItem.width * 0.5,  -renderItem.height * 0.5);
    }
    // context.rect(-1,  -1, renderItem.width + 1, renderItem.height + 1);
    context.moveTo(6, 0);
    context.lineTo(renderItem.width - 6, 0 )
    context.moveTo(0, 6);
    context.lineTo(0, renderItem.height - 6);
    context.moveTo(6, renderItem.height);
    context.lineTo(renderItem.width - 6, renderItem.height);
    context.moveTo(renderItem.width, renderItem.height -6);
    context.lineTo(renderItem.width, 6);

    context.rect(- 6, -6, 12, 12);
    context.rect(- 6 + renderItem.width, -6, 12, 12);
    context.rect(- 6, -6 + renderItem.height, 12, 12);
    context.rect(- 6 + renderItem.width, -6 + renderItem.height, 12, 12);

    context.moveTo(renderItem.width * 0.5, renderItem.height);
    context.lineTo(renderItem.width * 0.5, renderItem.height + 55);
    context.stroke();
    context.closePath();
    context.beginPath()
    context.arc(renderItem.width * 0.5, renderItem.height + 60, 6,0, 2 * Math.PI);
    context.stroke();
    context.closePath();
}