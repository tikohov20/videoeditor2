import {RenderItem, RenderItemPreview, RenderItems} from "./lib/shared/types.ts";

export interface TrackItem extends RenderItemPreview{}
export interface TrackItems extends Array<TrackItem>{}
export interface CanvasItem extends RenderItem{}
export interface CanvasItems extends RenderItems{}