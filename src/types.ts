import { RenderItem, RenderItemId, RenderItemPreview, RenderItems } from "./lib/shared/types.ts";

export interface TrackItem extends RenderItemPreview{}
export interface TrackItems extends Array<TrackItem>{}
export interface CanvasItem extends RenderItem{}
export interface CanvasItems extends RenderItems{}

export type CanvasItemId = RenderItemId;

export enum CanvasItemAction {
    RESIZE_TOP_LEFT = 'resize_top_left',
    RESIZE_TOP_RIGHT = 'resize_top_right',
    RESIZE_BOTTOM_LEFT = 'resize_bottom_left',
    RESIZE_BOTTOM_RIGHT = 'resize_bottom_right',
    RESIZE_LEFT = 'resize_left',
    RESIZE_RIGHT = 'resize_right',
    RESIZE_TOP = 'resize_top',
    RESIZE_BOTTOM = 'resize_bottom',
    DRAG = 'drag',
}
