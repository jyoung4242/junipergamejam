import { Actor, Engine, Sprite, vec, Vector } from "excalibur";

export class SolutionActor extends Actor {
  testSprite: Sprite;
  constructor(width: number, height: number, sprite: Sprite) {
    super({
      anchor: Vector.Zero,
      width,
      height,
      pos: vec(400 - 250, 75),
      z: 100,
    });
    this.testSprite = sprite.clone();
  }
  onInitialize(engine: Engine): void {
    this.graphics.use(this.testSprite);
  }

  onAdd(engine: Engine): void {
    engine.clock.schedule(() => {
      this.actions
        .fade(0.0, 1000)
        .toPromise()
        .then(() => {
          this.kill();
        });
    }, 1000);
  }
}
