// main.ts
import "./style.css";

import { Engine, DisplayMode, Color, SoundManager, Resource } from "excalibur";
import { loader, Resources } from "./resources";
import { GameScene, MyLevelData, PuzzleStats } from "./Scenes/game";
import { EndGameScene } from "./Scenes/end";
import { TitleScene } from "./Scenes/title";
import { JsfxrResource, SoundConfig } from "@excaliburjs/plugin-jsfxr";
import { sounds } from "./Sounds/sounds";
import { Loader } from "./Scenes/loader";

const game = new Engine({
  width: 800, // the width of the canvas
  height: 600, // the height of the canvas
  displayMode: DisplayMode.FitScreen, // the display mode
  pixelArt: true,
  scenes: {
    loader: new Loader(Resources),
    title: new TitleScene(),
    game: new GameScene<MyLevelData>(),
    end: new EndGameScene<PuzzleStats>(),
  },
  backgroundColor: Color.Black,
});

export const soundManager = new SoundManager({
  channels: ["fx", "music", "background"],
  sounds: {
    mainloop: { sound: Resources.mainLoop, volume: 0.1, channels: ["music"] },
    endloop: { sound: Resources.endLoop, volume: 0.1, channels: ["music"] },
  },
});

export let sndPlugin = new JsfxrResource();
sndPlugin.init(); //initializes the JSFXR library
for (const sound in sounds) {
  sndPlugin.loadSoundConfig(sound, sounds[sound]);
}

await game.start("loader");
// game.goToScene("game", { sceneActivationData: { difficulty: "easy" } });
// game.goToScene("end", {
//   sceneActivationData: {
//     stats: {
//       clicks: 0,
//       swaps: 0,
//       rotations: 0,
//       startTime: 63234115,
//       completionTime: 654189816,
//     },
//   },
// });
// game.goToScene("loader");
