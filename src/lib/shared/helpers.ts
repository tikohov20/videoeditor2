import { Frame, GifReader } from "omggif";
import { inv, transpose } from 'mathjs';
import { RenderItem } from "./types.ts";

export async function createImageBitMapFromHtmlImg(img :HTMLImageElement): Promise<ImageBitmap> {
    const canvas = new OffscreenCanvas(img.width, img.height);
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
            const frameInfo = gifInfo.frameInfo(k);
            const image = new ImageData(frameInfo.width, frameInfo.height);
            gifInfo.decodeAndBlitFrameRGBA(k, image.data);
            const initialBitMap = await window.createImageBitmap(image);
            ctx.drawImage(initialBitMap, 0, 0);
            return await window.createImageBitmap(ctx.getImageData(0, 0, gifInfo.width, gifInfo.height));
        })
    );
}

export function getFrameInfoArray(gifInfo: GifReader): Array<Frame> {
   return Array(gifInfo.numFrames()).fill(0).map((_, k) => {
        return gifInfo.frameInfo(k);
   })
}
const canvas = window.OffscreenCanvas ? new OffscreenCanvas(1, 1) : (document.createElement('canvas') as OffscreenCanvas);
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
