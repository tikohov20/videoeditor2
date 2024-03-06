import {RenderItem} from "../shared/types.ts";

export function drawItemEditBox(context: CanvasRenderingContext2D, renderItem: RenderItem) {
    context.beginPath();
    context.strokeStyle = "#8494b9";
    context.lineWidth = 2;
    context.rect(renderItem.x -1, renderItem.y -1, renderItem.width + 1, renderItem.height + 1);
    context.stroke();
    context.rect(renderItem.x - 6, renderItem.y -6, 12, 12);
    context.stroke();
    context.rect(renderItem.x - 6 + renderItem.width, renderItem.y -6, 12, 12);
    context.stroke();
    context.rect(renderItem.x - 6 + renderItem.width, renderItem.y -6 + renderItem.height, 12, 12);
    context.stroke();
    context.rect(renderItem.x - 6, renderItem.y -6 + renderItem.height, 12, 12);
    context.stroke();
}