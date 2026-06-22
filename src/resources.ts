// resources.ts
import { FontSource, ImageSource, Loader, Sound } from "excalibur";
import machine1 from "./Assets/machine_normalized.png";
import pbarFill from "./Assets/pbarFill.png";
import pbarTrack from "./Assets/pbarTrack.png";
import pbarBorder from "./Assets/pbarBorder.png";
import font from "./Assets/font.ttf";
import timerPanel from "./Assets/timerPanel.png";
import buttonNormal from "./Assets/buttonNormal.png";
import buttonPressed from "./Assets/buttonPressed.png";
import border from "./Assets/analyticsBorder.png";
import gear from "./Assets/gear.png";

// bgm

import gameLoop from "./Assets/torone-ecryme-generique-long-loop.ogg";
import endLoop from "./Assets/torone-ecryme-loop-04-dark-magic.mp3";

export const Resources = {
  machine1: new ImageSource(machine1),
  pbarBorder: new ImageSource(pbarBorder),
  pbarFill: new ImageSource(pbarFill),
  pbarTrack: new ImageSource(pbarTrack),
  timerPanel: new ImageSource(timerPanel),
  font: new FontSource(font, "deiselFont"),
  buttonNormal: new ImageSource(buttonNormal),
  buttonPressed: new ImageSource(buttonPressed),
  mainLoop: new Sound({ paths: [gameLoop], loop: true }),
  endLoop: new Sound({ paths: [endLoop], loop: true }),
  border: new ImageSource(border),
  gear: new ImageSource(gear),
};

export const loader = new Loader();

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
