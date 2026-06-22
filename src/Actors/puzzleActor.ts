import { Actor, Color, Engine, Sprite, vec, Vector } from "excalibur";
import { TileActor } from "./tileActor";
import { Resources } from "../resources";
import { Signal } from "../Lib/Signals";
import { GameScene, MyLevelData } from "../Scenes/game";
import { sndPlugin } from "../main";

export class PuzzleActor extends Actor {
  gameOverSignal: Signal = new Signal("gameover");
  flashCount: number = 0;
  flashLimit: number = 3;
  isFlashing: boolean = false;
  isGameOver: boolean = true;

  constructor(width: number, height: number) {
    super({
      anchor: Vector.Zero,
      width,
      height,
      pos: vec(400 - 250, 75),
    });
    // this.testSprite = sprite.clone();
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    // winning condition check
    const winningCondition = this.children
      .filter((child): child is TileActor => child instanceof TileActor)
      .every(tile => tile.inWinningPosition);

    if (!this.isFlashing && winningCondition && this.flashCount < this.flashLimit) {
      let gamescene = engine.currentScene as GameScene<MyLevelData>;
      if (gamescene.timerEnable == true) {
        gamescene.timerEnable = false;
        gamescene.puzzleStats.completionTime = Date.now();
        sndPlugin.playSound("done");
      }

      this.isFlashing = true;
      this.flashCount++;
      // place solution image on actor
      this.graphics.use(Resources.machine1.toSprite());
      //remove children
      this.removeAllChildren();
      // flash image
      this.actions
        .flash(Color.White, 1000)
        .toPromise()
        .then(() => {
          this.isFlashing = false;
          if (this.flashCount >= 2) this.isGameOver = false;
        });
    }

    if (!this.isGameOver && this.flashCount >= this.flashLimit && this.isFlashing) {
      //show gameover
      this.isGameOver = true;
      this.gameOverSignal.send();
      this.removeAllChildren();
    }
  }
}
