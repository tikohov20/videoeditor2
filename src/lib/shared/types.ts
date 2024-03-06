export enum FileTypes {
    PNG = "png"
}

export enum HtmlFileTypes {
    IMAGE_PNG = "image/png",
    IMAGE_JPEG = "image/jpeg",
}

// canvas data
export const InfiniteDuration = -1;
export const DefaultDuration = 1000; // ms
export const DefaultStart = 0; // ms
export const InitialX = 0;
export const InitialY = 0;
export const IndexMatrix =  [1,0,0,1,0,0];
// preview
export const DefaultImagePreviewSize = 6.25 // rem
export const RemToMilliSeconds = 160; // lol

export interface RenderItemPreview {
    id: number,
    src: string,
    size: number,
    start: number,
    renderItemId: number
}

export interface RenderItem {
    id: number,
    itemType: RenderItemTypes,
    maxDuration: number,
    duration: number,
    start: number,
    initialWidth: number,
    initialHeight: number,
    width: number,
    height: number,
    x: number,
    y: number,
    matrix: Array<number>,
    bitMap: CanvasImageSource, //TODO rename to imageSource
    isActive?: boolean,
    preview: RenderItemPreview
}

export enum RenderItemTypes {
    IMAGE = "image"
}

export interface RenderItemImage extends Modify<RenderItem, {
    itemType: RenderItemTypes.IMAGE
}> {}

export interface RenderItems extends Array<RenderItem>{}

export interface CanvasSize {
    width: number,
    height: number
}
type Modify<T, R> = Omit<T, keyof R> & R;
