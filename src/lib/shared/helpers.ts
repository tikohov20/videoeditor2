import { Frame, GifReader } from "omggif";
import { inv, transpose } from 'mathjs';
import { RenderItem } from "./types.ts";
import { Canvas } from "canvas";

export async function createImageBitMapFromHtmlImg(img :HTMLImageElement): Promise<ImageBitmap> {
    const canvas = getOffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d", {
        desynchronized: true
    });

    if (!ctx) throw "Error";

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);

    return await window.createImageBitmap(imageData);
}

export async function createGifBitMapArrayFromGifReader(gifInfo: GifReader):Promise<ImageBitmap[]> {
    // Canvas is a workaround for Gif quirks :3
    const canvas = new OffscreenCanvas(gifInfo.width, gifInfo.height);
    const ctx = canvas.getContext("2d", {
        desynchronized: true,
        willReadFrequently: true
    });
    if (!ctx) throw "Error";

    return await Promise.all(
        new Array(gifInfo.numFrames()).fill(0).map(async (_, k) => {
            // @ts-ignore
            const frameInfo = gifInfo.frameInfo(k);
            const image = new ImageData(gifInfo.width, gifInfo.height);

            gifInfo.decodeAndBlitFrameRGBA(k, image.data);

            const initialBitMap = await window.createImageBitmap(image);

            ctx.drawImage(initialBitMap, 0, 0, gifInfo.width, gifInfo.height);
            return await window.createImageBitmap(ctx.getImageData(0, 0, gifInfo.width, gifInfo.height));
        })
    );
}

export async function urlFromImageData(imageData: ImageData) {
    const canvas = new OffscreenCanvas(imageData.width, imageData.height);
    const ctx = canvas.getContext("2d", {
        desynchronized: true,
        willReadFrequently: true
    });
    if (!ctx) throw "Error";

    ctx.putImageData(imageData, 0, 0);

    return URL.createObjectURL(await canvas.convertToBlob());
}

export function getFrameInfoArray(gifInfo: GifReader): Array<Frame> {
   return Array(gifInfo.numFrames()).fill(0).map((_, k) => {
        return gifInfo.frameInfo(k);
   })
}

const canvas = window.OffscreenCanvas ? new OffscreenCanvas(1, 1) : (new Canvas(1, 1) as any);
const ctx = canvas.getContext("2d", {
    desynchronized: true,
    willReadFrequently: true
});

export function getTransformationMatrix(point: { x: number, y: number, rotation: {angle: number, x: number, y: number}, scaleX: number, scaleY: number }) {
    if(!ctx) throw new Error('oops');
    ctx.resetTransform();
    ctx.translate(point.x, point.y);
    ctx.translate(point.rotation.x, point.rotation.y);
    ctx.rotate(point.rotation.angle * Math.PI / 180);
    ctx.translate( -point.rotation.x, -point.rotation.y);
    ctx.scale(point.scaleX, point.scaleY);

    return ctx.getTransform();
}

export function getIndexMatrix() {
    return getTransformationMatrix({ x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: { angle: 0, x: 0, y: 0 }});
}

export function invertMatrix(matrix: number[][]) {
    return transpose(inv(matrix));
}

export function isRenderItemVisible(renderItem: RenderItem, timeStamp: number): boolean {
    return renderItem.start <= timeStamp && timeStamp < renderItem.start + renderItem.duration
}

export function getArrayBufferFromFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.readAsArrayBuffer(file);
        fr.onload = async function() {
            const arrayBuffer = fr.result as ArrayBufferLike;
            resolve(arrayBuffer);
        }
        fr.onerror = function() {
            reject("Error parsing file")
        }
    });
}

export function getOffscreenCanvas(width: number, height: number): OffscreenCanvas {
    return window.OffscreenCanvas ? new OffscreenCanvas(width, height) : (new Canvas(width, height) as any);
}
