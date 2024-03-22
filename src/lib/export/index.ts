import {RenderItems} from "../shared/types.ts";

import { Muxer, ArrayBufferTarget } from "mp4-muxer";
import { renderTimestamp } from "../renderer";

export async function exportCanvas(
    targetCanvas: HTMLCanvasElement,
    renderItems: RenderItems,
    from = 0,
    to = 1000,
    fps = 30,
    bitrate = 3500_000,
    width = 1920,
    height = 1080
) {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
        desynchronized: true,
    });

    if (ctx === null) {
        throw new Error('Unexpected error during export');
    }

    const frameNum = Math.floor((to - from) * fps * 0.001);

    const muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: {
            codec: "avc",
            width: canvas.width,
            height: canvas.height,
        },
        fastStart: "in-memory",
    });

    const videoEncoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: (e) => console.error(e),
    });

    videoEncoder.configure({
        codec: "avc1.4d4034",
        width: canvas.width,
        height: canvas.height,
        bitrate,
        bitrateMode: "constant",
    });


    // const scaleX = width / targetCanvas.width;
    const scale = height / targetCanvas.height;

    for (let frameNumber = 0; frameNumber < frameNum; frameNumber++) {
        renderTimestamp(canvas, ctx, from + frameNumber * 1000 / fps, renderItems, false, (context, renderItem) => {
            const matrix = renderItem.matrix.scale(scale);
            context.setTransform(matrix)
        })
        let frame = new VideoFrame(canvas, {
            timestamp: (frameNumber * 1e6) / fps,
        });
        videoEncoder.encode(frame);
        frame.close();
    }

    await videoEncoder.flush();

    muxer.finalize();

    let buffer = muxer.target.buffer;
    downloadBlob(new Blob([buffer]));
}


function downloadBlob(blob: Blob) {
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "animation.mp4";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}