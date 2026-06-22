import * as ex from "excalibur";

type Rotation = 0 | 90 | -90 | 180;

const ROTATIONS: Rotation[] = [0, 90, -90, 180];

export function shuffleTiledChildren(
  parent: ex.Actor,
  tileWidth: number,
  tileHeight: number,
  cols: number,
  rows: number,
  rotations: Rotation[] = [0, 90, -90, 180],
): void {
  const children = parent.children as ex.Actor[];

  if (children.length === 0) return;

  // Cell centers
  const allPositions: ex.Vector[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      allPositions.push(ex.vec(col * tileWidth + tileWidth / 2, row * tileHeight + tileHeight / 2));
    }
  }

  // Fisher-Yates shuffle
  const shuffled = [...allPositions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  children.forEach((child, i) => {
    const rot = rotations[Math.floor(Math.random() * rotations.length)];
    child.pos = shuffled[i % shuffled.length].clone();
    child.rotation = ex.toRadians(rot);
  });
}
