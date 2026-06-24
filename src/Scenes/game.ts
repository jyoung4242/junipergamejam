import { Scene, Rectangle, SceneActivationContext, Sprite, SpriteSheet, Slide, vec, Entity, Engine } from "excalibur";
import { Resources } from "../resources";
import { TileActor } from "../Actors/tileActor";
import { PuzzleActor } from "../Actors/puzzleActor";
import { resampleSpriteToFit } from "../Lib/scaleSprite";
import { shuffleTiledChildren } from "../Lib/shuffleTiles";
import { Signal } from "../Lib/Signals";
import { setupGameUI } from "../UI/gameSceneUI";
import { UIProgressBar, UISpriteProgressBar } from "../UI/progressBar";
import { sndPlugin, soundManager } from "../main";
import { MachineGeneration } from "../Lib/machineGen";
import { UIFocusManager } from "../UI/uiFocusManager";

type Rotation = 0 | 90 | 180 | 270;
const EasyRowsCols = 3;
const MediumRowsCols = 4;
const HardRowsCols = 5;
const GameViewTargetWidth = 500;
const GameViewTargetHeight = 500;

interface PuzzleState {
  machineId: string;
  rows: number;
  cols: number;
  solved: boolean;
  completionPercent: number;
  // tiles: TileActor[];
}

export interface TileInitData {
  startingX: number;
  startingY: number;
  width: number;
  height: number;
  scaleFactor: number;
}

interface SourceImageDims {
  width: number;
  height: number;
}

export interface PuzzleStats {
  clicks: number;
  swaps: number;
  rotations: number;
  startTime: number;
  completionTime: number;
}

interface TileSelectionState {
  first: TileActor | null;
  second: TileActor | null;
}

type DifficultyLevel = "easy" | "medium" | "hard";

export interface MyLevelData {
  difficulty: DifficultyLevel;
}

export class GameScene<T extends MyLevelData> extends Scene {
  fm: UIFocusManager | null = null;
  //GameState
  difficulty: DifficultyLevel = "easy";
  timerSeconds: number = 0;
  score: number = 0;
  selectedTileId: number | null = null;
  puzzleState: PuzzleState | null = null;
  puzzleStats: PuzzleStats = {
    clicks: 0,
    swaps: 0,
    rotations: 0,
    startTime: 0,
    completionTime: 0,
  };
  levelImage: Sprite | null = null;
  levelImageDims: SourceImageDims | null = null;
  puzzleActor: PuzzleActor | null = null;
  scalefactor: number = 1.0;
  selectedTiles: TileSelectionState = {
    first: null,
    second: null,
  };
  tileSignal: Signal = new Signal("tileselect");
  swapSignal: Signal = new Signal("tileswap");
  clickSignal: Signal = new Signal("clickSignal");
  gameOverSignal: Signal = new Signal("gameover");
  rotateSignal: Signal = new Signal("rotation");
  timerIncSignal: Signal = new Signal("timerTik");

  timerTick: number = 0;
  timerLimit: number = 1000;
  timerEnable: boolean = true;

  constructor() {
    super();
  }

  //runs when scene is created, once
  onInitialize(engine: Engine) {
    this.tileSignal.listen((params: any) => {
      // manage tile selections

      const [tile, state] = params.detail.params;
      if (!(tile instanceof TileActor)) throw new Error("bad tile");

      if (state == "SELECTED") {
        //check selectedTiles
        if (this.selectedTiles.first == null) {
          this.selectedTiles.first = tile;
        } else {
          this.selectedTiles.second = tile;
          // swap tiles
          this.puzzleStats.swaps++;
          sndPlugin.playSound("swap");
          this.swapSignal.send([this.selectedTiles.first, this.selectedTiles.second]);
          this.selectedTiles.first = this.selectedTiles.second = null;
        }
      } else {
        // unselected tile, find in selectedTiles
        if (this.selectedTiles.first == null) return;
        if (this.selectedTiles.first.id == tile.id) {
          this.selectedTiles.first = null;
        }
      }
    });

    this.clickSignal.listen(() => {
      this.puzzleStats.clicks++;
    });

    this.rotateSignal.listen(() => {
      this.puzzleStats.rotations++;
    });

    this.gameOverSignal.listen(() => {
      const duration = this.puzzleStats.completionTime - this.puzzleStats.startTime;
      const hours = Math.floor(duration / 3_600_000);
      const minutes = Math.floor((duration % 3_600_000) / 60_000);
      const seconds = Math.floor((duration % 60_000) / 1_000);
      const milliseconds = duration % 1_000;
      engine.goToScene("end", { sceneActivationData: { stats: this.puzzleStats } });
    });
  }

  //runs when scene is moved into
  async onActivate(ctx: SceneActivationContext<MyLevelData>) {
    this.fm = new UIFocusManager();
    document.addEventListener("keydown", this.tabHandler);
    this.selectedTiles = {
      first: null,
      second: null,
    };
    this.puzzleStats.startTime = Date.now();
    // reset game state
    this.resetStats();
    this.difficulty = ctx.data ? ctx.data.difficulty : "easy";

    // set image dimensions
    const scaleX = GameViewTargetWidth / Resources.machine1.image.width;
    const scaleY = GameViewTargetHeight / Resources.machine1.image.height;
    this.scalefactor = Math.min(scaleX, scaleY);

    this.levelImageDims = {
      width: Resources.machine1.image.width * this.scalefactor,
      height: Resources.machine1.image.height * this.scalefactor,
    };

    this.levelImage = await resampleSpriteToFit(Resources.machine1.toSprite(), this.levelImageDims.width, this.levelImageDims.height);

    // init puzzle parent
    this.puzzleActor = new PuzzleActor(this.levelImage.width, this.levelImage.height);
    this.puzzleActor.removeAllChildren();
    this.add(this.puzzleActor);

    //********************************************************* */
    // Machine Generation
    /* REMOVE THIS SECTION TO FALLBACK TO PLACEHOLDER IMAGE*/
    this.levelImage = await MachineGeneration.generateImage();
    //***********************************************************/

    this.puzzleActor.updatePuzzleActorImage(this.levelImage);

    // init puzzleState
    // based on difficulty level, determine rows and cols
    this.puzzleState = {
      machineId: "machine1",
      rows: 0,
      cols: 0,
      solved: false,
      completionPercent: 0,
      // tiles: [],
    };
    this.puzzleState.rows = this.difficulty === "easy" ? EasyRowsCols : this.difficulty === "medium" ? MediumRowsCols : HardRowsCols;
    this.puzzleState.cols = this.difficulty === "easy" ? EasyRowsCols : this.difficulty === "medium" ? MediumRowsCols : HardRowsCols;
    let numtiles = this.puzzleState.rows * this.puzzleState.cols;

    // create tile states with correct source rects and correct grid positions
    let sLengthWidth = this.levelImageDims.width / this.puzzleState.cols;
    let sLengthHeight = this.levelImageDims.height / this.puzzleState.rows;

    // create spritesheet from sprite based on dims
    let ss = SpriteSheet.fromImageSource({
      image: this.levelImage.image,
      grid: { rows: this.puzzleState.rows, columns: this.puzzleState.cols, spriteHeight: sLengthHeight, spriteWidth: sLengthWidth },
    });

    let halfwidth = sLengthWidth / 2;
    for (let i = 0; i < numtiles; i++) {
      const Sx = i % this.puzzleState.cols;
      const Sy = Math.floor(i / this.puzzleState.cols);
      const sXPos = Sx + Sx * sLengthWidth + halfwidth;
      const sYPos = Sy + Sy * sLengthHeight + halfwidth;

      const tile = new TileActor({
        width: sLengthWidth,
        height: sLengthHeight,
        startingX: sXPos,
        startingY: sYPos,
        scaleFactor: this.scalefactor,
      });

      tile.setGraphic(ss.getSprite(Sx, Sy));
      // this.puzzleState.tiles.push(tile);
      this.puzzleActor.addChild(tile);
    }

    // shuffle tiles
    shuffleTiledChildren(this.puzzleActor, sLengthWidth, sLengthHeight, this.puzzleState.cols, this.puzzleState.rows);

    setupGameUI(this);

    this.puzzleStats.startTime = Date.now();
    this.timerTick = 0;
    this.timerEnable = true;
  }

  //runs when scene is moved out of
  onDeactivate() {
    this.fm = null;
    document.removeEventListener("keydown", this.tabHandler);
    soundManager.stop("mainloop");
    //remove all entities
    let ents = this.entities;
    if (this.puzzleActor) this.remove(this.puzzleActor);
    this.puzzleActor = null;
    ents.forEach((ent: Entity) => {
      ent.kill();
    });
  }
  tabHandler = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault(); // stop browser focus jump
      if (!this.fm) return;
      this.fm.moveFocus(true);
    }
  };

  onPreUpdate(_engine: Engine, delta: number) {
    // UI update checks

    //progressbar
    if (this.puzzleActor != undefined) {
      let percent = 0;
      let numChildren = this.puzzleActor.children.length;
      let percentPerChild = 1 / numChildren;

      const pbar = this.entities.find((ent: Entity) => ent instanceof UISpriteProgressBar);
      if (numChildren != 0 && pbar) {
        this.puzzleActor.children.forEach((child: Entity) => {
          if (child instanceof TileActor) {
            if (child.inWinningPosition) {
              percent += percentPerChild;
            }
          }
        });

        pbar.value = percent * 100;
      }
    }

    //timer
    if (this.timerEnable && this.puzzleActor != undefined) {
      this.timerTick += delta;
      if (this.timerTick >= this.timerLimit) {
        this.timerTick = 0; //reset
        this.timerIncSignal.send();
      }
    }
  }

  resetStats() {
    this.puzzleStats.clicks = 0;
    this.puzzleStats.swaps = 0;
    this.puzzleStats.startTime = 0;
    this.puzzleStats.completionTime = 0;
    this.puzzleStats.rotations = 0;
  }
}
