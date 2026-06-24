import { Actor, Color, Engine, Sprite, vec, Vector } from "excalibur";
import { TileActor } from "./tileActor";
import { Signal } from "../Lib/Signals";
import { GameScene, MyLevelData } from "../Scenes/game";
import { sndPlugin } from "../main";

export class PuzzleActor extends Actor {
  gameOverSignal: Signal = new Signal("gameover");
  flashCount: number = 0;
  flashLimit: number = 3;
  isFlashing: boolean = false;
  isGameOver: boolean = true;
  latchedWinning: boolean = false;
  finalImage: Sprite | null = null;
  firstTimeThrough = true;

  constructor(width: number, height: number) {
    super({
      anchor: Vector.Zero,
      width,
      height,
      pos: vec(400 - 250, 75),
    });
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    let winningCondition =
      this.children.length > 0 &&
      this.children.filter((child): child is TileActor => child instanceof TileActor).every(tile => tile.inWinningPosition);

    if (winningCondition) {
      //run action
      this.actions
        .callMethod(() => {
          let gamescene = engine.currentScene as GameScene<MyLevelData>;
          gamescene.timerEnable = false;
          gamescene.puzzleStats.completionTime = Date.now();
          sndPlugin.playSound("done");
          if (!this.finalImage) return;
          this.graphics.use(this.finalImage);
          this.removeAllChildren();
        })
        .flash(Color.White, 1000)
        .flash(Color.White, 1000)
        .flash(Color.White, 1000)
        .callMethod(() => {
          this.isGameOver = true;
          this.gameOverSignal.send();
        });
    }
  }

  updatePuzzleActorImage(img: Sprite) {
    this.finalImage = img.clone();
  }
}
