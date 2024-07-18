import {
    DefaultDuration,
    DefaultImagePreviewSize, DefaultOpacity, DefaultRotation,
    DefaultStart,
    InfiniteDuration,
    RenderItemPreview,
    RenderItemText,
    RenderItemTypes
} from "../shared/types.ts";

import { getIndexMatrix } from "../shared/helpers.ts";

async function getCanvasData(name: string): Promise<RenderItemText> {
    const id = Math.random();
    const matrix = getIndexMatrix();
    return {
        id,
        name,
        itemType: RenderItemTypes.TEXT,
        maxDuration: InfiniteDuration,
        duration: DefaultDuration,
        start: DefaultStart,
        initialWidth: 301,
        initialHeight: 50,
        width: 301,
        height: 50,
        x: 0, // TODO this is bad idea ( I remembered ) WHY IS THIS A BAD IDEA, TELL ME NAXUY
        y: 0,
        bitMap: null,
        preview: getPreviewData(id),
        textData: {
            text: getTextData("Hi hi hellooooooooooo", 301),
            lineWidth: 1,
            fillStyle: 'white',
            strokeStyle: 'black',
            font: 'italic 50px serif',
            fontSize: 50,
        },
        matrix,
        scaleX: 1,
        scaleY: 1,
        rotation: DefaultRotation,
        opacity: DefaultOpacity
    }
}

function getPreviewData(id: number): RenderItemPreview {
    return {
        id: Math.random(),
        src: 'src/assets/txt.png',
        size: DefaultImagePreviewSize,
        start: DefaultStart,
        renderItemId: id
    }
}

function getTextData(text: string, width: number) {
    const canvas = new OffscreenCanvas(500, 500);
    const ctx = canvas.getContext("2d", {
        desynchronized: true
    });

    if (!ctx) throw "Error";

    ctx.direction = 'ltr';
    ctx.font = "italic 50px monospace";

    const measurments = ctx.measureText(text);
    const textWidth = Math.round(measurments.width);
    if(textWidth > width) {
        // return text.replaceAll(' ', "\n");
    }

    return text;
}

export async function parse(name: string): Promise<RenderItemText> {
    return new Promise((resolve) => {
        resolve(getCanvasData(name));
    })
}

export function getFrame(renderItem: RenderItemText): string {
    return renderItem.textData.text;
}
