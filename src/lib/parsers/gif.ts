import { GifReader } from "omggif";
import { createGifBitMapArrayFromGifReader, getIndexMatrix } from "../shared/helpers.ts";
import {
    CanvasSize, DefaultOpacity, DefaultRotation,
    DefaultStart,
    InitialX,
    InitialY,
    RenderItemGif,
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
        preview: {
            id: Math.random(),
            src: "https://picsum.photos/200/300",
            start: 0,
            size: 1000,
            renderItemId: id
        },
        matrix,
        rotation: DefaultRotation,
        opacity: DefaultOpacity,
        // keyframes: {
        //     0: {
        //         width: 200,
        //         height: 200,
        //         x: 0,
        //     },
        //     1000: {
        //         width: 500,
        //         height: 205,
        //         x: 200
        //     },
        //     2000: {
        //         width: 500,
        //         height: 500,
        //         x: 0
        //     }
        // }
    }
}
export function parse(file: File, canvasSize: CanvasSize): Promise<RenderItemGif> {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.readAsArrayBuffer(file);
        fr.onload = async function() {
            const arrayBuffer = new Uint8Array(fr.result as ArrayBufferLike);
            const parsedGif = new GifReader(arrayBuffer);
            const parsedData = await getCanvasData(parsedGif, canvasSize, file.name);
            resolve(parsedData);
        }
        fr.onerror = function() {
            reject("Error parsing gif")
        }
    });
}

export function getFrame(timeStamp: number, renderItem: RenderItemGif) {
    if(!Array.isArray(renderItem.bitMap)) return null;

    // How far along are we in a gif
    const relativeTimeStamp = timeStamp - renderItem.start;
    const currentFrame = Math.floor(relativeTimeStamp / renderItem.gifData.delay) % renderItem.gifData.frameCount;

    return renderItem.bitMap[currentFrame];
}