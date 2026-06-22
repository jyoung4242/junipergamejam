import { Vector } from "excalibur";

export function getTileTargetPosition(
  index: number,
  columns: number,
  tileWidth: number,
  tileHeight: number,
  originX = 0,
  originY = 0,
): Vector {
  const col = index % columns;
  const row = Math.floor(index / columns);

  return new Vector(originX + col * tileWidth + tileWidth / 2, originY + row * tileHeight + tileHeight / 2);
}
