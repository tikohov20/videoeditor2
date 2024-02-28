import { RenderItem, RenderItems } from "./lib/shared/types.ts";

export interface TrackItem {
    id: number,
    src: string,
    size: number,
    start: number,
}
export interface TrackItems extends Array<TrackItem>{}

export interface CanvasItem extends RenderItem{}
export interface CanvasItems extends RenderItems{}