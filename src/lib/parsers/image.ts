import {
    CanvasSize,
    DefaultDuration,
    DefaultImagePreviewSize,
    DefaultStart, IndexMatrix,
    InfiniteDuration,
    InitialX, InitialY, RenderItemImage, RenderItemPreview, RenderItemTypes
} from "../shared/types.ts";

import { createImageBitMapFromHtmlImg } from "../shared/helpers.ts";

async function getCanvasData(img: HTMLImageElement, canvasSize: CanvasSize): Promise<RenderItemImage> {
    const matrix = [...IndexMatrix];

    if(img.height > canvasSize.height) {
        matrix[0] = canvasSize.height / img.height;
        matrix[3] = matrix[0]
    }

    const id = Math.random();

    return {
        id,
        itemType: RenderItemTypes.IMAGE,
        maxDuration: InfiniteDuration,
        duration: DefaultDuration,
        start: DefaultStart,
        initialWidth: img.width,
        initialHeight: img.height,
        width: img.width,
        height: img.height,
        x: InitialX,
        y: InitialY,
        bitMap: await createImageBitMapFromHtmlImg(img),
        preview: getPreviewData(img, id),
        matrix,
    }
}

function getPreviewData(img: HTMLImageElement, id: number): RenderItemPreview {
    return {
        id: Math.random(),
        src: img.src,
        size: DefaultImagePreviewSize,
        start: DefaultStart,
        renderItemId: id
    }
}

export function parse(file: File, canvasSize: CanvasSize): Promise<RenderItemImage> {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = async function() {
            const canvasItem = await getCanvasData(img, canvasSize);
            resolve(canvasItem);
        }
    });
}

export function getFrame(timeStamp: number, renderItem: RenderItemImage): CanvasImageSource | null {
    if (renderItem.start <= timeStamp && timeStamp <= renderItem.start + renderItem.duration) {
        return renderItem.bitMap;
    }
    return null;
}