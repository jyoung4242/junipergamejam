import { Entity, Scene, SceneActivationContext } from "excalibur";
import { setupTitleGameUI } from "../UI/titleUI";
import { soundManager } from "../main";
import { UIFocusManager } from "../UI/uiFocusManager";

export class TitleScene extends Scene {
  fcsmanager: UIFocusManager | null = null;
  constructor() {
    super();
  }

  onActivate(context: SceneActivationContext<unknown, undefined>): void {
    this.fcsmanager = new UIFocusManager();
    soundManager.play("mainloop");
    setupTitleGameUI(this);

    document.addEventListener("keydown", this.tabHandler);
  }

  tabHandler = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault(); // stop browser focus jump
      if (!this.fcsmanager) return;
      if (e.shiftKey) {
        this.fcsmanager.moveFocus(false);
      } else {
        this.fcsmanager.moveFocus(true);
      }
    }
  };

  onDeactivate(context: SceneActivationContext) {
    document.removeEventListener("keydown", this.tabHandler);
    let ents = this.entities;
    ents.forEach((ent: Entity) => {
      ent.kill();
    });
  }
}
