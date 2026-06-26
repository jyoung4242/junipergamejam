import { Color, Engine, Font, Scene, TextAlign, vec, Vector } from "excalibur";
import { UISpriteProgressBar, UISpriteProgressBarConfig } from "./progressBar";
import { Resources } from "../resources";
import { UISpritePanel, UISpritePanelConfig } from "./panel";
import { UILabel, UILabelConfig } from "./label";
import { Signal } from "../Lib/Signals";
import { UISpriteButton, UISpriteButtonConfig } from "./uiButton";
import { sndPlugin } from "../main";
import { SolutionActor } from "../Actors/solutionActor";
import { GameScene, MyLevelData } from "../Scenes/game";
import { UIImage, UIImageConfig } from "./uiImage";

function createProgressBar(scene: Scene) {
  const pBarconfig: UISpriteProgressBarConfig = {
    name: "pbar",
    width: 200,
    height: 34,
    pos: vec(400, 20),
    z: 1,
    value: 0,
    orientation: "horizontal",
    sprites: {
      track: Resources.pbarTrack.toSprite(),
      fill: Resources.pbarFill.toSprite(),
      border: Resources.pbarBorder.toSprite(),
    },
    showPercentage: false,
  };
  const pBar = new UISpriteProgressBar(pBarconfig);

  scene.add(pBar);
}

function createTimer(scene: Scene) {
  const timerPanelConfig: UISpritePanelConfig = {
    name: "timerpanel",
    z: 1,
    height: 48,
    width: 156,
    pos: vec(200, 12),
    sprite: Resources.timerPanel.toSprite(),
  };
  const timerLabelConfig: UILabelConfig = {
    name: "timerlabel",
    z: 2,
    width: 150,
    height: 48,
    pos: vec(24, -3),
    text: "0m:00s",

    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 42,
        textAlign: TextAlign.Center,
      }),
    },
  };

  let timerPanel = new UISpritePanel(timerPanelConfig);

  class TimerTikClass extends UILabel {
    timerIncSignal: Signal = new Signal("timerTik");
    seconds: number = 0;

    onInitialize(engine: Engine): void {
      super.onInitialize(engine);

      this.timerIncSignal.listen(() => {
        this.seconds++;
        const minutes = Math.floor(this.seconds / 60);
        const seconds = this.seconds % 60;
        this.setText(`${minutes}m:${seconds.toString().padStart(2, "0")}s`);
      });
    }

    reset() {
      this.seconds = 0;
    }
  }

  let timerLabel = new TimerTikClass(timerLabelConfig);

  timerPanel.addChild(timerLabel);
  scene.add(timerPanel);
}

function createButtons(scene: GameScene<MyLevelData>) {
  const hintButtonConfig: UISpriteButtonConfig = {
    name: "hintbutton",
    width: 110,
    height: 39,
    pos: vec(25, 50),
    z: 100,
    sprites: {
      idle: Resources.buttonNormal.toSprite(),
      pressed: Resources.buttonPressed.toSprite(),
      hovered: Resources.buttonNormal.toSprite(),
      disabled: Resources.buttonNormal.toSprite(),
    },
    callback: () => {
      // console.trace("hint");
      if (!scene.levelImage) throw new Error("bad image");
      sndPlugin.playSound("click");
      //Gaurd if solution still in scene
      if (scene.entities.find(ent => ent instanceof SolutionActor)) return;
      scene.hintSignal.send();
      scene.add(new SolutionActor(500, 500, scene.levelImage));
    },
    idleText: "Hint",
    hoveredText: "Hint",
    activeText: "Hint",
    textOffset: vec(0, -5),
    tabStopIndex: 0,
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 18,
        textAlign: TextAlign.Center,
      }),
    },
  };
  const hintButton = new UISpriteButton(hintButtonConfig);
  scene.add(hintButton);

  const gobackButtonConfig: UISpriteButtonConfig = {
    name: "hintbutton",
    width: 110,
    height: 39,
    pos: vec(25, 100),
    z: 100,
    tabStopIndex: 1,
    sprites: {
      idle: Resources.buttonNormal.toSprite(),
      pressed: Resources.buttonPressed.toSprite(),
      hovered: Resources.buttonNormal.toSprite(),
      disabled: Resources.buttonNormal.toSprite(),
    },
    callback: () => {
      // console.trace("go back ");
      sndPlugin.playSound("click");
      scene.engine.goToScene("title");
    },
    idleText: "Go Back",
    hoveredText: "Go Back",
    activeText: "Go Back",
    textOffset: vec(0, -5),
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 18,
        textAlign: TextAlign.Center,
      }),
    },
  };
  const gobackButton = new UISpriteButton(gobackButtonConfig);
  scene.add(gobackButton);

  scene.fm?.register([hintButton, gobackButton]);
  scene.fm?.setFocus(hintButton);
}

function createUIHelp(scene: GameScene<MyLevelData>) {
  let config: UIImageConfig = {
    name: "help",
    width: 75,
    height: 110,
    pos: vec(25, 300),
    image: Resources.uihelp,
    z: 100,
  };

  let image = new UIImage(config);
  image.scale = vec(1.5, 1.5);
  scene.add(image);
}

export function setupGameUI(scene: GameScene<MyLevelData>) {
  createProgressBar(scene);
  createTimer(scene);
  createButtons(scene);
  createUIHelp(scene);
}
