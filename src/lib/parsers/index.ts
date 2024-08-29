import { parse as parseImage, getFrame as getImageFrame } from "./image.ts";
import { parse as parseGif, getFrame as getGifFrame } from "./gif.ts";
import { parse as parseText, getFrame as getTextFrame } from "./text.ts";
import { parse as parseVideo } from "./video.ts";

import {
    CanvasSize,
    HtmlFileTypes,
    RenderItem,
    RenderItemGif,
    RenderItemImage, RenderItemText,
    RenderItemTypes
} from "../shared/types.ts";
import { isRenderItemVisible } from "../shared/helpers.ts";

export async function parse(file: File | string, canvasSize: CanvasSize): Promise<RenderItem> {
    if (file instanceof File) {
        const type = file.type;

        switch (type) {
            case HtmlFileTypes.IMAGE_PNG:
            case HtmlFileTypes.IMAGE_JPEG:
                return await parseImage(file, canvasSize);
            case HtmlFileTypes.IMAGE_GIF:
                return await parseGif(file, canvasSize)
            case HtmlFileTypes.VIDEO_MP4:
                return await parseVideo(file, canvasSize)
            default:
                throw "File Type Unsupported"
        }
    }

    // TEXT
    return await parseText(file);
}

export function getFrame(timeStamp: number, renderItem: RenderItem) {
    const { itemType } = renderItem;

    if (!isRenderItemVisible(renderItem, timeStamp)) return null;

    switch(itemType) {
        case RenderItemTypes.IMAGE:
            return getImageFrame(renderItem as RenderItemImage)
        case RenderItemTypes.GIF:
            return getGifFrame(timeStamp, renderItem as RenderItemGif);
        case RenderItemTypes.TEXT:
            return getTextFrame(renderItem as RenderItemText)
        default:
            throw "Item Type Not Supported"
    }
}