import {
  Actor,
  Color,
  Engine,
  Font,
  Line,
  NineSliceStretch,
  RotateBy,
  Scene,
  ScreenElement,
  TextAlign,
  toRadians,
  vec,
  Vector,
} from "excalibur";
import { UINineSlicePanel, UINineSlicePanelConfig, UISpritePanel, UISpritePanelConfig } from "./panel";
import { UISpriteButton, UISpriteButtonConfig } from "./uiButton";
import { UILabel, UILabelConfig } from "./label";
import { Resources } from "../resources";
import { TitleScene } from "../Scenes/title";
import { sndPlugin } from "../main";
import { UIFocusManager } from "./uiFocusManager";

export function setupTitleGameUI(scene: TitleScene) {
  buildAnalyticsPanel(scene);
}

const buildAnalyticsPanel = (scene: TitleScene) => {
  const analyticsPanelConfig: UINineSlicePanelConfig = {
    name: "analyticsPanel",
    width: 500,
    height: 400,
    z: 1,
    pos: vec(400 - 250, 100),
    sprite: Resources.timerPanel.toSprite(),
    sourceConfig: {
      width: 156,
      height: 48,
      topMargin: 9,
      bottomMargin: 9,
      leftMargin: 12,
      rightMargin: 12,
    },
    destinationConfig: {
      stretchH: NineSliceStretch.Stretch,
      stretchV: NineSliceStretch.Stretch,
      drawCenter: true,
    },
  };
  const analyticsPanel = new UINineSlicePanel(analyticsPanelConfig);
  addReturnButton(analyticsPanel, scene.fcsmanager as UIFocusManager);
  addAnalyticsBorder(analyticsPanel, scene);
  scene.add(analyticsPanel);
};

const addReturnButton = (panel: UINineSlicePanel, fm: UIFocusManager) => {
  const easyButtonConfig: UISpriteButtonConfig = {
    name: "returnbutton",
    width: 110,
    height: 39,
    pos: vec(75, 300),
    z: 1,
    sprites: {
      idle: Resources.buttonNormal.toSprite(),
      pressed: Resources.buttonPressed.toSprite(),
      hovered: Resources.buttonNormal.toSprite(),
      disabled: Resources.buttonNormal.toSprite(),
    },
    callback: () => {
      sndPlugin.playSound("click");
      panel.scene?.engine.goToScene("game", { sceneActivationData: { difficulty: "easy" } });
    },
    idleText: "Easy",
    hoveredText: "Easy",
    activeText: "Easy",
    textOffset: vec(0, -5),
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 18,
        textAlign: TextAlign.Center,
      }),
    },
    tabStopIndex: 0,
  };
  const easyButton = new UISpriteButton(easyButtonConfig);
  panel.addChild(easyButton);

  const MediumButtonConfig: UISpriteButtonConfig = {
    name: "returnbutton",
    width: 110,
    height: 39,
    pos: vec(200, 300),
    z: 1,
    sprites: {
      idle: Resources.buttonNormal.toSprite(),
      pressed: Resources.buttonPressed.toSprite(),
      hovered: Resources.buttonNormal.toSprite(),
      disabled: Resources.buttonNormal.toSprite(),
    },
    callback: () => {
      sndPlugin.playSound("click");
      panel.scene?.engine.goToScene("game", { sceneActivationData: { difficulty: "medium" } });
    },
    idleText: "Medium",
    hoveredText: "Medium",
    activeText: "Medium",
    textOffset: vec(0, -5),
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 18,
        textAlign: TextAlign.Center,
      }),
    },
    tabStopIndex: 1,
  };
  const MediumButton = new UISpriteButton(MediumButtonConfig);
  panel.addChild(MediumButton);

  const hardButtonConfig: UISpriteButtonConfig = {
    name: "returnbutton",
    width: 110,
    height: 39,
    pos: vec(325, 300),
    z: 1,
    sprites: {
      idle: Resources.buttonNormal.toSprite(),
      pressed: Resources.buttonPressed.toSprite(),
      hovered: Resources.buttonNormal.toSprite(),
      disabled: Resources.buttonNormal.toSprite(),
    },
    callback: () => {
      sndPlugin.playSound("click");
      panel.scene?.engine.goToScene("game", { sceneActivationData: { difficulty: "hard" } });
    },
    idleText: "Hard",
    hoveredText: "Hard",
    activeText: "Hard",
    textOffset: vec(0, -5),
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 18,
        textAlign: TextAlign.Center,
      }),
    },
    tabStopIndex: 2,
  };
  const hardButton = new UISpriteButton(hardButtonConfig);

  panel.addChild(hardButton);
  fm.register([easyButton, MediumButton, hardButton]);
  fm.setFocus(easyButton);
};

const addAnalyticsBorder = (panel: UINineSlicePanel, scene: TitleScene) => {
  let panelConfig: UISpritePanelConfig = {
    name: "border",
    width: 350,
    height: 250,
    z: 2,
    pos: vec(250 - 350 / 2, 20),
    sprite: Resources.border.toSprite(),
  };
  let borderPanel = new UISpritePanel(panelConfig);
  addDataLabels(borderPanel);
  panel.addChild(borderPanel);
  panel.addChild(new SpinningGears(vec(30, 30), 25));
  panel.addChild(new SpinningGears(vec(470, 30), 25));
  panel.addChild(new SpinningGears(vec(30, 370), 25));
  panel.addChild(new SpinningGears(vec(470, 370), 25));
};

const addDataLabels = (panel: UISpritePanel) => {
  const puzzleTitleConfig: UILabelConfig = {
    name: "puzzletitle",
    z: 2,
    width: 500,
    height: 45,
    pos: vec(350 / 2 - 85, 5),
    text: "STEAMSPIN",
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 40,
        textAlign: TextAlign.Center,
      }),
    },
  };
  const puzzleTitle: UILabel = new UILabel(puzzleTitleConfig);
  panel.addChild(puzzleTitle);

  // draw line
  class lineElement extends ScreenElement {
    constructor() {
      super({
        width: 350,
        height: 10,
        pos: vec(0, 0),
        z: 3,
      });
      this.graphics.use(
        new Line({
          start: vec(20, 60),
          end: vec(330, 60),
          color: Color.fromHex("#101C00"),
          thickness: 2,
        }),
      );
    }
  }
  panel.addChild(new lineElement());

  const instructionsTitleConfig: UILabelConfig = {
    name: "instructionstitle",
    z: 2,
    width: 350,
    height: 200,
    pos: vec(5, 70),
    text: `How to Play:

    Left click of mouse selects tiles, select two tiles to swap.
    
    Right click of mouse rotates tile 90 degrees
    `,
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 20,
        textAlign: TextAlign.Center,
      }),
    },
  };
  const instructionsTitle: UILabel = new UILabel(instructionsTitleConfig);
  panel.addChild(instructionsTitle);
};

class SpinningGears extends Actor {
  constructor(pos: Vector, radius: number) {
    super({
      pos,
      radius,
      z: 3,
    });
    this.graphics.use(Resources.bigGear.toSprite());
    this.graphics.current!.scale = vec(0.75, 0.75);
  }

  onAdd(engine: Engine): void {
    this.actions.repeatForever(cts => {
      cts.rotateBy({
        angleRadiansOffset: toRadians(90),
        duration: 500,
      });
    });
  }
}
