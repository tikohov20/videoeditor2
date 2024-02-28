import { parse as parseImage, getFrame as getImageFrame } from "./image.ts";
import {HtmlFileTypes, RenderItem, RenderItemTypes} from "../shared/types.ts";

export async function parse(file: File) {
    const type = file.type;
    switch (type) {
        case HtmlFileTypes.IMAGE_PNG:
        case HtmlFileTypes.IMAGE_JPEG:
            return await parseImage(file);
        default:
            throw "File Type Unsupported"
    }
}

export function getFrame(timeStamp: number, renderItem: RenderItem) {
    const { itemType } = renderItem;

    switch(itemType) {
        case RenderItemTypes.IMAGE:
            return getImageFrame(timeStamp, renderItem)
        default:
            throw "Item Type Not Supported"
    }
}