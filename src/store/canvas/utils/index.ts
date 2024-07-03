import { CanvasItem } from "../../../types.ts";

//TODO config
const CANVAS_LENGTH = 1024;
const CANVAS_HEIGHT = 576;
const STICKY_MARGIN = 7;

enum POSITION_ENUM {
    LEFT = 'x-left',
    HORIZONTAL_CENTER = 'x-center',
    RIGHT = 'x-right',
    TOP = 'y-top',
    BOTTOM = 'y-bottom',
    VERTICAL_CENTER = 'y-center',
}
const CANVAS_LEFT = 0;
const CANVAS_HORIZONTAL_CENTER = CANVAS_LENGTH / 2;
const CANVAS_RIGHT = CANVAS_LENGTH;
const CANVAS_BOTTOM = 0;
const CANVAS_TOP = CANVAS_HEIGHT;
const CANVAS_VERTICAL_CENTER = CANVAS_HEIGHT / 2;

function initGetItemStickyMapping() {
    const cache: {[key: number]: { [key: string]: number[] }} = {};

    return function (canvasItem: CanvasItem) {

        //TODO doesn't work when item gets resized and so on....

        // if (cache[canvasItem.id]) {
        //     return cache[canvasItem.id];
        // }

        cache[canvasItem.id] = {
            [POSITION_ENUM.LEFT]: [CANVAS_LEFT, /*CANVAS_HORIZONTAL_CENTER*/],
            [POSITION_ENUM.HORIZONTAL_CENTER]: [CANVAS_LEFT - canvasItem.width / 2, CANVAS_HORIZONTAL_CENTER - canvasItem.width / 2, CANVAS_RIGHT - canvasItem.width / 2],
            [POSITION_ENUM.RIGHT]: [/*CANVAS_HORIZONTAL_CENTER - canvasItem.width*/, CANVAS_RIGHT - canvasItem.width],
            [POSITION_ENUM.BOTTOM]: [CANVAS_BOTTOM, /*CANVAS_VERTICAL_CENTER*/],
            [POSITION_ENUM.TOP]: [CANVAS_TOP - canvasItem.height, /*CANVAS_VERTICAL_CENTER - canvasItem.height*/],
            [POSITION_ENUM.VERTICAL_CENTER]: [CANVAS_TOP - canvasItem.height / 2, CANVAS_VERTICAL_CENTER - canvasItem.height / 2, CANVAS_BOTTOM - canvasItem.height / 2 ],
        } as {[key: string]: number[]}

        return cache[canvasItem.id];
    }
}

const getItemStickyMapping = initGetItemStickyMapping();

export const stickCanvasItemToImportantPositions = (x: number, y: number, canvasItem: CanvasItem): number[] => {
    let _x = x;
    let _y = y;

    const mapping = getItemStickyMapping(canvasItem);
    for (let item in mapping) {
        if (item.split('-')[0] === 'x') {
            mapping[item].forEach(value => {
                if(x > value - STICKY_MARGIN && x < value + STICKY_MARGIN) {
                    _x = value;
                }
            })
        }
        if (item.split('-')[0] === 'y') {
            mapping[item].forEach(value => {
                if(y > value - STICKY_MARGIN && y < value + STICKY_MARGIN) {
                    _y = value;
                }
            })
        }
    }

    return [_x, _y]
}