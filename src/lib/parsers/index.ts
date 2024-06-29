import { getFrame as getImageFrame, parse as parseImage } from "./image.ts";
import { parse as parseGif, getFrame as getGifFrame } from "./gif.ts";
import {
    CanvasSize,
    HtmlFileTypes,
    RenderItem,
    RenderItemGif,
    RenderItemImage,
    RenderItemTypes
} from "../shared/types.ts";
import { isRenderItemVisible } from "../shared/helpers.ts";

export async function parse(file: File, canvasSize: CanvasSize): Promise<RenderItem> {
    const type = file.type;
    switch (type) {
        case HtmlFileTypes.IMAGE_PNG:
        case HtmlFileTypes.IMAGE_JPEG:
            return await parseImage(file, canvasSize);
        case HtmlFileTypes.IMAGE_GIF:
            return await parseGif(file, canvasSize)
        default:
            throw "File Type Unsupported"
    }
}

export function getFrame(timeStamp: number, renderItem: RenderItem) {
    const { itemType } = renderItem;

    if (!isRenderItemVisible(renderItem, timeStamp)) return null;

    switch(itemType) {
        case RenderItemTypes.IMAGE:
            return getImageFrame(renderItem as RenderItemImage)
        case RenderItemTypes.GIF:
            return getGifFrame(timeStamp, renderItem as RenderItemGif);
        default:
            throw "Item Type Not Supported"
    }
}