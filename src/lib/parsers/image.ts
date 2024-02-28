import {
    DefaultDuration,
    DefaultImagePreviewSize,
    DefaultStart,
    InfiniteDuration,
    InitialX, InitialY, RenderItemImage, RenderItemTypes
} from "../shared/types.ts";
import {createImageBitMapFromHtmlImg} from "../shared/helpers.ts";

export function parse(file: File): Promise<{data: any, preview: any}> {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = async function() {
            resolve({
                data: await getCanvasData(img),
                preview: getPreviewData(img)
            })
        }
    });
}

export function getFrame(timeStamp: number, renderItem: RenderItemImage): CanvasImageSource | null {
    if (renderItem.start <= timeStamp && timeStamp <= renderItem.start + renderItem.duration) {
        return renderItem.bitMap;
    }
    return null;
}

async function getCanvasData(img: HTMLImageElement): Promise<RenderItemImage> {
    return {
        id: Math.random(),
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
        bitMap: await createImageBitMapFromHtmlImg(img)
    }
}

function getPreviewData(img: HTMLImageElement) {
    return {
        id: Math.random(),
        src: img.src,
        size: DefaultImagePreviewSize,
        start: DefaultStart
    }
}