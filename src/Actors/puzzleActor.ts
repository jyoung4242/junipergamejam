import { Actor, Color, Engine, ImageSource, Sprite, vec, Vector } from "excalibur";
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
    // this.testSprite = sprite.clone();
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

    // if (this.firstTimeThrough) {
    //   this.firstTimeThrough = false;
    //   return;
    // }
    // let winningCondition = false;
    // // winning condition check
    // if (this.children.length > 0) {
    //   const winningCondition = this.children
    //     .filter((child): child is TileActor => child instanceof TileActor)
    //     .every(tile => tile.inWinningPosition);
    //   console.log(winningCondition);
    // }

    // if (winningCondition && !this.latchedWinning) this.latchedWinning = true;

    // if (this.latchedWinning) debugger;
    // console.log(this.isFlashing, this.latchedWinning, this.flashCount, this.flashLimit, this.isGameOver);

    // if (!this.isFlashing && this.latchedWinning && this.flashCount < this.flashLimit) {
    //   let gamescene = engine.currentScene as GameScene<MyLevelData>;
    //   if (gamescene.timerEnable == true) {
    //     gamescene.timerEnable = false;
    //     gamescene.puzzleStats.completionTime = Date.now();
    //     sndPlugin.playSound("done");
    //   }

    //   this.isFlashing = true;
    //   this.flashCount++;
    //   // place solution image on actor
    //   console.log("winning", this.finalImage);

    //   if (!this.finalImage) return;
    //   this.graphics.use(this.finalImage);
    //   //remove children
    //   this.removeAllChildren();
    //   // flash image
    //   this.actions
    //     .flash(Color.White, 1000)
    //     .toPromise()
    //     .then(() => {
    //       console.log("flash done");
    //       this.isFlashing = false;
    //       if (this.flashCount >= 2) this.isGameOver = false;
    //     });
    // }

    // if (!this.isGameOver && this.flashCount >= this.flashLimit && this.isFlashing) {
    //   //show gameover
    //   console.log("sending GO signal");

    //   this.isGameOver = true;
    //   this.gameOverSignal.send();
    //   this.removeAllChildren();
    // }

    // if (this.isFlashing && this.latchedWinning) {
    //   debugger;
    // }
  }

  updatePuzzleActorImage(img: Sprite) {
    this.finalImage = img.clone();
  }
}
