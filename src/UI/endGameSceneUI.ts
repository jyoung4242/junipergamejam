import { Color, Font, Line, NineSliceStretch, Scene, ScreenElement, TextAlign, vec } from "excalibur";
import { UINineSlicePanel, UINineSlicePanelConfig, UISpritePanel, UISpritePanelConfig } from "./panel";
import { UISpriteButton, UISpriteButtonConfig } from "./uiButton";
import { UILabel, UILabelConfig } from "./label";
import { Resources } from "../resources";
import { EndGameScene } from "../Scenes/end";
import { PuzzleStats } from "../Scenes/game";
import { sndPlugin } from "../main";

export function setupEndGameUI(scene: EndGameScene<PuzzleStats>) {
  buildAnalyticsPanel(scene);
}

const buildAnalyticsPanel = (scene: EndGameScene<PuzzleStats>) => {
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
  addReturnButton(analyticsPanel);
  addAnalyticsBorder(analyticsPanel, scene);
  scene.add(analyticsPanel);
};

const addReturnButton = (panel: UINineSlicePanel) => {
  const returnButtonConfig: UISpriteButtonConfig = {
    name: "returnbutton",
    width: 110,
    height: 39,
    pos: vec(250 - 55, 300),
    z: 1,
    sprites: {
      idle: Resources.buttonNormal.toSprite(),
      pressed: Resources.buttonPressed.toSprite(),
      hovered: Resources.buttonNormal.toSprite(),
      disabled: Resources.buttonNormal.toSprite(),
    },
    callback: () => {
      sndPlugin.playSound("click");
      console.trace("game end -> how did i get here");
      panel.scene?.engine.goToScene("title");
    },
    idleText: "Play Again",
    hoveredText: "Play Again",
    activeText: "Play Again",
    textOffset: vec(0, -5),
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 12,
        textAlign: TextAlign.Center,
      }),
    },
  };
  const returnButton = new UISpriteButton(returnButtonConfig);
  panel.addChild(returnButton);
};

const addAnalyticsBorder = (panel: UINineSlicePanel, scene: EndGameScene<PuzzleStats>) => {
  const sceneData = scene.stats;
  let panelConfig: UISpritePanelConfig = {
    name: "border",
    width: 350,
    height: 250,
    z: 2,
    pos: vec(250 - 350 / 2, 20),
    sprite: Resources.border.toSprite(),
  };
  let borderPanel = new UISpritePanel(panelConfig);
  //@ts-expect-error
  addDataLabels(borderPanel, sceneData.stats as PuzzleStats);
  panel.addChild(borderPanel);
};

const addDataLabels = (panel: UISpritePanel, stats: PuzzleStats) => {
  const puzzleTitleConfig: UILabelConfig = {
    name: "puzzletitle",
    z: 2,
    width: 500,
    height: 35,
    pos: vec(350 / 2 - 100, 5),
    text: "PUZZLE COMPLETE",
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 30,
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
          start: vec(20, 45),
          end: vec(330, 45),
          color: Color.fromHex("#101C00"),
          thickness: 2,
        }),
      );
    }
  }
  panel.addChild(new lineElement());

  //Time Label
  const timeTitleConfig: UILabelConfig = {
    name: "timeTitle",
    z: 2,
    width: 500,
    height: 35,
    pos: vec(50, 60),
    text: "Duration:  ",
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 24,
        textAlign: TextAlign.Center,
      }),
    },
  };
  const timeTitle: UILabel = new UILabel(timeTitleConfig);
  panel.addChild(timeTitle);

  //Clicks label
  const clicksTitleConfig: UILabelConfig = {
    name: "clicksTitle",
    z: 2,
    width: 500,
    height: 35,
    pos: vec(50, 100),
    text: "Clicks:  ",
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 24,
        textAlign: TextAlign.Center,
      }),
    },
  };
  const clicksTitle: UILabel = new UILabel(clicksTitleConfig);
  panel.addChild(clicksTitle);

  //Swaps Label
  const swapsTitleConfig: UILabelConfig = {
    name: "swapsTitle",
    z: 2,
    width: 500,
    height: 35,
    pos: vec(50, 140),
    text: "Tile Swaps:  ",
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 24,
        textAlign: TextAlign.Center,
      }),
    },
  };
  const swapsTitle: UILabel = new UILabel(swapsTitleConfig);
  panel.addChild(swapsTitle);

  //Rotations Label
  const rotsTitleConfig: UILabelConfig = {
    name: "rotsTitle",
    z: 2,
    width: 500,
    height: 35,
    pos: vec(50, 180),
    text: "Tile Spins:  ",
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 24,
        textAlign: TextAlign.Center,
      }),
    },
  };
  const rotsTitle: UILabel = new UILabel(rotsTitleConfig);
  panel.addChild(rotsTitle);

  const duration = stats.completionTime - stats.startTime;
  const hours = Math.floor(duration / 3_600_000);
  const minutes = Math.floor((duration % 3_600_000) / 60_000);
  const seconds = Math.floor((duration % 60_000) / 1_000);
  const milliseconds = duration % 1_000;

  //Duration Amount Label
  const timeDataConfig: UILabelConfig = {
    name: "timedata",
    z: 2,
    width: 500,
    height: 35,
    pos: vec(160, 60),
    text: `${minutes}m : ${seconds}s : ${milliseconds}ms`,
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 24,
        textAlign: TextAlign.Center,
      }),
    },
  };
  const timeData: UILabel = new UILabel(timeDataConfig);
  panel.addChild(timeData);

  //Clicks amount
  const clicksDataConfig: UILabelConfig = {
    name: "clicksData",
    z: 2,
    width: 500,
    height: 35,
    pos: vec(160, 100),
    text: `${stats.clicks}`,
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 24,
        textAlign: TextAlign.Center,
      }),
    },
  };
  const clicksData: UILabel = new UILabel(clicksDataConfig);
  panel.addChild(clicksData);

  //Swaps amount
  const swapsDataConfig: UILabelConfig = {
    name: "swapsData",
    z: 2,
    width: 500,
    height: 35,
    pos: vec(160, 140),
    text: `${stats.swaps}`,
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 24,
        textAlign: TextAlign.Center,
      }),
    },
  };
  const swapsData: UILabel = new UILabel(swapsDataConfig);
  panel.addChild(swapsData);

  //Rotations amount
  const rotsDataConfig: UILabelConfig = {
    name: "rotsData",
    z: 2,
    width: 500,
    height: 35,
    pos: vec(160, 180),
    text: `${stats.rotations}`,
    textOptions: {
      color: Color.fromHex("#101C00"),
      font: new Font({
        family: "deiselFont",
        size: 24,
        textAlign: TextAlign.Center,
      }),
    },
  };
  const rotsData: UILabel = new UILabel(rotsDataConfig);
  panel.addChild(rotsData);
};
