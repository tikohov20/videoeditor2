export async function createImageBitMapFromHtmlImg(img :HTMLImageElement) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw "Error";

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);

    return await window.createImageBitmap(imageData);
}