import { Sprite, ImageSource } from "excalibur";

export async function resampleSpriteToFit(sprite: Sprite, targetWidth: number, targetHeight: number): Promise<Sprite> {
  const sourceImage = sprite.image;

  const srcW = sprite.width;
  const srcH = sprite.height;

  // scale to fit (preserve aspect ratio)
  const scale = Math.min(targetWidth / srcW, targetHeight / srcH);

  const destW = Math.floor(srcW * scale);
  const destH = Math.floor(srcH * scale);

  // create canvas
  const canvas = document.createElement("canvas");
  canvas.width = destW;
  canvas.height = destH;

  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false; // or false for pixel art

  // clear (optional, transparent background)
  ctx.clearRect(0, 0, destW, destH);

  ctx.drawImage(
    sourceImage.image, // HTMLImageElement
    0,
    0,
    srcW,
    srcH,
    0,
    0,
    destW,
    destH,
  );

  // build new Excalibur image + sprite
  const image = new ImageSource(canvas.toDataURL());
  await image.load();
  const newSprite = image.toSprite();
  return newSprite;
}
