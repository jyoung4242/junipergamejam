import { Actor, Engine, Sprite, vec, Vector, PointerEvent, Rectangle, Color, toRadians, toDegrees } from "excalibur";
import { TileInitData } from "../Scenes/game";
import { Signal } from "../Lib/Signals";
import { sndPlugin } from "../main";
import { MoveSnapToOptions, MoveSnapToWithOptions } from "../Actions/MoveSnapTo";

export const SelectState = {
  UNSELECTED: "unselected",
  SELECTED: "selected",
} as const;
export type SelectState = keyof typeof SelectState;

export class TileActor extends Actor {
  scalingFactor: Vector;
  borderActor: BorderActor;
  tileSignal = new Signal("tileselect");
  swapSignal = new Signal("tileswap");
  swapComplete = new Signal("swapComplete");
  clickSignal = new Signal("clickSignal");
  rotateSignal = new Signal("rotation");
  newPos: Vector | null = null;
  isSwapping: boolean = false;
  debugFlag: boolean = false;

  clickEnable: boolean = true;
  enabled: boolean = false;
  selectState: SelectState = "UNSELECTED";
  oldselectState: SelectState = "UNSELECTED";
  winningState: { pos: Vector } = {
    pos: vec(0, 0),
  };
  inWinningPosition: boolean = false;

  constructor(config: TileInitData) {
    super({
      width: config.width,
      height: config.height,
      pos: vec(config.startingX, config.startingY),
      anchor: Vector.Half,
    });
    this.winningState.pos = this.pos.clone();
    this.scalingFactor = vec(config.scaleFactor, config.scaleFactor);
    this.borderActor = new BorderActor(config.width, config.height);
    this.addChild(this.borderActor);
  }

  onInitialize(engine: Engine): void {
    this.swapSignal.listen((params: any) => {
      this.isSwapping = true;
      //get tile params from params
      const [tile1, tile2] = params.detail.params;
      if (tile1.id == this.id) {
        this.newPos = tile2.pos.clone();
      } else if (tile2.id == this.id) {
        this.newPos = tile1.pos.clone();
      } else return;

      this.selectState = "UNSELECTED";
      engine.clock.schedule(this.swapTile, 250);
    });
    this.swapComplete.listen(() => {
      this.isSwapping = false;
    });
  }

  swapTile = () => {
    if (!this.newPos) throw new Error("pad vector for newpos");

    this.actions
      .runAction(new MoveSnapToWithOptions(this, { pos: this.newPos, duration: 500, snapDistance: 5 }))
      .toPromise()
      .then(() => {
        this.debugFlag = true;
        this.swapComplete.send();
      });
    this.selectState = "UNSELECTED";
    this.borderActor.changeState("idle");
  };

  setGraphic(sprite: Sprite) {
    this.graphics.use(sprite);
    if (!this.graphics.current) throw new Error("bad graphics");
  }

  toggle = () => {
    if (this.selectState == "SELECTED") {
      this.selectState = "UNSELECTED";
      this.borderActor.changeState("idle");
    } else {
      this.selectState = "SELECTED";
      this.borderActor.changeState("selected");
    }
  };

  onAdd(): void {
    this.on("pointerup", this.clickHandler);
  }

  onRemove(): void {
    this.off("pointerup", this.clickHandler);
  }

  clickHandler = (evt: PointerEvent) => {
    if (this.isSwapping) return;
    this.clickSignal.send();
    if (this.inWinningPosition) {
      sndPlugin.playSound("bad");
      this.borderActor.changeState("warning");
      return;
    }
    if (evt.button == "Left") {
      sndPlugin.playSound("tileselect");
      this.toggle();

      this.tileSignal.send([this, this.selectState]);
    } else if (evt.button == "Right") {
      if (this.clickEnable) {
        this.rotateSignal.send();
        this.clickEnable = false;
        sndPlugin.playSound("rotate");
        this.actions
          .rotateBy({ angleRadiansOffset: toRadians(90), duration: 500 })
          .toPromise()
          .then(() => {
            this.clickEnable = true;
          });
      }
    }
  };

  onPreUpdate(engine: Engine, elapsed: number): void {
    if (!this.inWinningPosition) {
      const rotation = ((toDegrees(this.rotation) % 360) + 360) % 360;
      if (this.positionCheck() && Math.abs(rotation) < 0.01) {
        this.inWinningPosition = true;
        sndPlugin.playSound("correct");
        this.actions.flash(Color.White, 1000);
        this.borderActor.changeState("transparent");
      }
    }
  }

  positionCheck(): boolean {
    let distance = this.pos.distance(this.winningState.pos);
    return distance <= 5;
  }
}

const borderState = {
  selected: "selected",
  idle: "idle",
  warning: "warning",
  transparent: "transparent",
} as const;
type borderState = keyof typeof borderState;

export class BorderActor extends Actor {
  selected: borderState = "idle";
  constructor(width: number, height: number) {
    super({
      pos: Vector.Zero,
      width,
      height,
      z: 3,
    });

    this.graphics.use(
      new Rectangle({ width: width - 0, height: height - 0, color: Color.Transparent, lineWidth: 1, strokeColor: Color.White }),
    );
  }
  changeState(state: borderState) {
    this.selected = state;
    if (this.selected == "selected") {
      this.graphics.use(
        new Rectangle({ width: this.width, height: this.height, color: Color.Transparent, lineWidth: 5, strokeColor: Color.Green }),
      );
    } else if (this.selected == "idle") {
      this.graphics.use(
        new Rectangle({ width: this.width, height: this.height, color: Color.Transparent, lineWidth: 1, strokeColor: Color.White }),
      );
    } else if (this.selected == "warning") {
      this.graphics.use(
        new Rectangle({ width: this.width, height: this.height, color: Color.Transparent, lineWidth: 4, strokeColor: Color.Red }),
      );
      this.actions
        .delay(1000)
        .fade(0.0, 500)
        .callMethod(() => this.changeState("idle"))
        .fade(1.0, 0.3);
    } else if (this.selected == "transparent") {
      this.graphics.hide();
    }
  }
}
