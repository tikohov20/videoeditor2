import { GifReader } from "omggif";
import {
    createGifBitMapArrayFromGifReader,
    getArrayBufferFromFile,
    getIndexMatrix,
    urlFromImageData
} from "../shared/helpers.ts";
import {
    CanvasSize,
    DefaultImagePreviewSize,
    DefaultOpacity,
    DefaultRotation,
    DefaultStart,
    InitialX,
    InitialY,
    RenderItemGif,
    RenderItemPreview,
    RenderItemTypes
} from "../shared/types.ts";

async function getCanvasData(parsedGif: GifReader, canvasSize: CanvasSize, name: string): Promise<RenderItemGif> {
    const { width, height } = parsedGif;
    const id = Math.random();
    const frameInfo = parsedGif.frameInfo(0);

    const matrix = getIndexMatrix();
    let scale = 1;

    if (height > canvasSize.height) {
        scale = canvasSize.height / height;
    }
    matrix.scaleSelf(scale);

    const previewImage = new ImageData(parsedGif.width, parsedGif.height);
    parsedGif.decodeAndBlitFrameRGBA(0, previewImage.data);

    return {
        id,
        name,
        itemType: RenderItemTypes.GIF,
        maxDuration: frameInfo.delay * parsedGif.numFrames() * 10,
        duration: frameInfo.delay * parsedGif.numFrames() * 10,
        start: DefaultStart,
        initialWidth: width,
        initialHeight: height,
        width: Math.round(width * matrix.a),
        height: Math.round(height * matrix.d),
        scaleX: scale,
        scaleY: scale,
        x: InitialX,
        y: InitialY,
        bitMap: await createGifBitMapArrayFromGifReader(parsedGif),
        gifData: {
            frameCount: parsedGif.numFrames(),
            delay: frameInfo.delay * 10
        },
        preview: await getPreviewData(previewImage, id),
        matrix,
        rotation: DefaultRotation,
        opacity: DefaultOpacity,
        keyframes: null,
    }
}
export async function parse(file: File, canvasSize: CanvasSize): Promise<RenderItemGif> {
    const parsedGif = new GifReader(new Uint8Array(await getArrayBufferFromFile(file)));
    return await getCanvasData(parsedGif, canvasSize, file.name);
}

async function getPreviewData(previewImage: ImageData, id: number): Promise<RenderItemPreview> {

    const src = await urlFromImageData(previewImage);
    return {
        id: Math.random(),
        src,
        size: DefaultImagePreviewSize,
        start: DefaultStart,
        renderItemId: id
    }
}

export function getFrame(timeStamp: number, renderItem: RenderItemGif) {
    if(!Array.isArray(renderItem.bitMap)) return null;

    // How far along are we in a gif
    const relativeTimeStamp = timeStamp - renderItem.start;
    const currentFrame = Math.floor(relativeTimeStamp / renderItem.gifData.delay) % renderItem.gifData.frameCount;

    return renderItem.bitMap[currentFrame];
}