import { Entity, Scene, SceneActivationContext } from "excalibur";
import { setupEndGameUI } from "../UI/endGameSceneUI";
import { PuzzleStats } from "./game";
import { soundManager } from "../main";

export class EndGameScene<T extends PuzzleStats> extends Scene {
  stats: PuzzleStats | unknown;
  constructor() {
    super();
  }

  onActivate(context: SceneActivationContext<PuzzleStats>): void {
    soundManager.play("endloop");
    this.stats = context!.data
      ? context.data
      : {
          clicks: 0,
          swaps: 0,
          rotations: 0,
          startTime: 0,
          completionTime: 0,
        };
    setupEndGameUI(this);
  }

  onDeactivate(context: SceneActivationContext) {
    soundManager.stop("endloop");
    let uiElements = this.entities;
    uiElements.forEach((el: Entity) => {
      el.kill();
    });
  }
}
