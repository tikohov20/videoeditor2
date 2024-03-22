import {
    CanvasSize,
    DefaultDuration,
    DefaultImagePreviewSize, DefaultOpacity, DefaultRotation,
    DefaultStart,
    InfiniteDuration,
    InitialX, InitialY, RenderItemImage, RenderItemPreview, RenderItemTypes
} from "../shared/types.ts";

import {createImageBitMapFromHtmlImg, getIndexMatrix} from "../shared/helpers.ts";

async function getCanvasData(img: HTMLImageElement, canvasSize: CanvasSize, name: string): Promise<RenderItemImage> {
    const id = Math.random();
    const matrix = getIndexMatrix();

    let scale = 1;

    if (img.height > canvasSize.height) {
        scale = canvasSize.height / img.height;
    }
    matrix.scaleSelf(scale);

    return {
        id,
        name,
        itemType: RenderItemTypes.IMAGE,
        maxDuration: InfiniteDuration,
        duration: DefaultDuration,
        start: DefaultStart,
        initialWidth: img.width,
        initialHeight: img.height,
        width: Math.round(img.width * matrix.a),
        height: Math.round(img.height * matrix.d),
        x: InitialX, // TODO this is bad idea ( I remembered )
        y: InitialY,
        bitMap: await createImageBitMapFromHtmlImg(img),
        preview: getPreviewData(img, id),
        matrix,
        scaleX: scale,
        scaleY: scale,
        rotation: DefaultRotation,
        opacity: DefaultOpacity
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
            const canvasItem = await getCanvasData(img, canvasSize, file.name);
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