import {
    CanvasSize,
    RenderItemImage
} from "../shared/types.ts";

import { MP4Demuxer } from './mp4/demuxer_mp4.js';

export function parse(file: File, canvasSize: CanvasSize): Promise<RenderItemImage> {
    return new Promise((resolve, reject) => {
        const url = window.URL.createObjectURL(file);
        const promiseArray: Array<Promise<ImageBitmap>> = [];

        const decoder = new VideoDecoder({
            output(frame) {
                promiseArray.push(window.createImageBitmap(frame));
            },
            error(e) {
                console.log(e);
            },
        });
        const chunks = [];
        const demuxer = new MP4Demuxer(url, {
            onConfig(config: any) {
                decoder.configure(config);
            },
            onChunk(chunk: any) {
                decoder.decode(chunk);
                chunks.push(chunk);
            },
            onFinish() {
                decoder.flush().then(() => {
                    Promise.all(promiseArray).then((data) => {
                        console.log(data);
                    })
                })
            }
        });
    });
}
