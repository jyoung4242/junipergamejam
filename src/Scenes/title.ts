import { Entity, Scene, SceneActivationContext } from "excalibur";
import { setupTitleGameUI } from "../UI/titleUI";
import { soundManager } from "../main";

export class TitleScene extends Scene {
  constructor() {
    super();
  }

  onActivate(context: SceneActivationContext<unknown, undefined>): void {
    soundManager.play("mainloop");
    setupTitleGameUI(this);
  }
  onDeactivate(context: SceneActivationContext) {
    let ents = this.entities;
    ents.forEach((ent: Entity) => {
      ent.kill();
    });
  }
}
