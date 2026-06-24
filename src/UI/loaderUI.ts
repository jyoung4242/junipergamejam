import { Color, Font, Scene, vec, DefaultLoader } from "excalibur";
import { UIProgressBar } from "./progressBar";
import { UILabel } from "./label";

import { Loader } from "../Scenes/loader";

function createProgressBar(scene: Scene) {
  const pBar = new UIProgressBar({
    name: "pbar",
    width: 600,
    height: 30,
    pos: vec(150, 300),
  });
  (scene as Loader).pbar = pBar;
  scene.add(pBar);
}

function createLoadingLabel(scene: Scene) {
  const label = new UILabel({
    name: "loadinglabel",
    width: 400,
    height: 100,
    pos: vec(400 - 100, 250),
    text: "LOADING...",
    textOptions: {
      color: Color.White,
      font: new Font({
        size: 36,
      }),
    },
  });
  (scene as Loader).label = label;

  scene.add(label);
}

export function setupLoaderUI(scene: Scene) {
  createProgressBar(scene);
  createLoadingLabel(scene);
}
