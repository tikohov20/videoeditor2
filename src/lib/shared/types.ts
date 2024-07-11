export enum FileTypes {
    PNG = "png"
}

export enum HtmlFileTypes {
    IMAGE_PNG = "image/png",
    IMAGE_JPEG = "image/jpeg",
    IMAGE_GIF = "image/gif"
}

// canvas data
export const InfiniteDuration = -1;
export const DefaultDuration = 1000; // ms
export const DefaultStart = 0; // ms
export const DefaultRotation = 0; // degrees
export const DefaultOpacity = 1;
export const InitialX = 0;
export const InitialY = 0;

// [ScaleX, ?, ?, ScaleY, OffsetX, OffsetY]
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
    name: string,
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
    matrix: DOMMatrix,
    rotation: number,
    scaleX: number,
    scaleY: number,
    opacity: number,
    bitMap: CanvasImageSource | Array<CanvasImageSource> | null, //TODO rename to imageSource
    isActive?: boolean,
    isVisible?: boolean,
    isHidden?: boolean
    preview: RenderItemPreview,
    keyframes?: KeyFrames | null,
}

export interface KeyFrames {
    [key: number]: {
        width?: number,
        height?: number,
        x?: number,
        y?: number
    }
}

interface KeyFrame {
    width?:  number,
    height?: number,
    x?: number,
    y?: number
}

export enum RenderItemTypes {
    IMAGE = "image",
    GIF = "gif",
    TEXT = "text"
}

export interface RenderItemImage extends Modify<RenderItem, {
    itemType: RenderItemTypes.IMAGE,
    bitMap: CanvasImageSource
}> {}

export interface RenderItemGif extends Modify<RenderItem, {
    itemType: RenderItemTypes.GIF,
    bitMap: Array<CanvasImageSource>
    gifData: {
        frameCount: number,
        delay: number
    }
}> {}

export interface RenderItemText extends Modify<RenderItem, {
    itemType: RenderItemTypes.TEXT,
    bitMap: null,
    textData: {
        text: string
    }
}> {}

export interface RenderItems extends Array<RenderItem>{}

export interface CanvasSize {
    width: number,
    height: number
}
type Modify<T, R> = Omit<T, keyof R> & R;
