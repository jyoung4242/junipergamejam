import { DefaultSceneLoader } from "../Lib/customSceneLoader";

import {
  Engine,
  Color,
  vec,
  Font,
  SceneActivationContext,
  Loadable,
  Util,
  TextAlign,
  ImageSource,
  toDegrees,
  toRadians,
  Vector,
} from "excalibur";
import { UIButton, UISpriteButton, UISpriteButtonConfig } from "../UI/uiButton";
import { UIProgressBar } from "../UI/progressBar";
import { UILabel } from "../UI/label";
import { setupLoaderUI } from "../UI/loaderUI";
import { sndPlugin } from "../main";
import { Resources } from "../resources";
import eximage from "../Assets/title/ex.png";
import { UIImage } from "../UI/uiImage";
import bigGear from "../Assets/gear.png";

export class Loader extends DefaultSceneLoader {
  button: UIButton | null = null;
  pbar: UIProgressBar | null = null;
  label: UILabel | null = null;
  exImage: ImageSource;
  gear: ImageSource;
  gearActor: UIImage | null = null;

  constructor(resources: any) {
    super(resources);
    this.exImage = new ImageSource(eximage);
    this.gear = new ImageSource(bigGear);
  }

  // Set up UI elements
  async onInitialize(engine: Engine): Promise<void> {
    await this.exImage.load();
    await this.gear.load();
    this.add(
      new UIImage({
        name: "exImage",
        width: 300,
        height: 100,
        pos: vec(400 - 150, 500),
        image: this.exImage,
      }),
    );
    this.gearActor = new UIImage({
      name: "gear",
      width: 100,
      height: 100,
      pos: vec(140, 315),
      image: this.gear,
      z: 10,
    });
    this.gearActor.anchor = Vector.Half;
    this.add(this.gearActor);
    this.gearActor.actions.repeatForever(ctx => ctx.rotateBy({ angleRadiansOffset: toRadians(90), duration: 250 }));

    setupLoaderUI(this);
  }

  createButtons() {
    const hintButtonConfig: UISpriteButtonConfig = {
      name: "Playbutton",
      width: 200,
      height: 76,
      pos: vec(400 - 100, 450),
      z: 100,
      sprites: {
        idle: Resources.buttonNormal.toSprite(),
        pressed: Resources.buttonPressed.toSprite(),
        hovered: Resources.buttonNormal.toSprite(),
        disabled: Resources.buttonNormal.toSprite(),
      },
      callback: () => {
        sndPlugin.playSound("click");
        this.engine.goToScene("title");
      },
      idleText: "PLAY",
      hoveredText: "PLAY",
      activeText: "PLAY",
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
    const hintButton = new UISpriteButton(hintButtonConfig);

    this.add(hintButton);
    hintButton.focus();
  }

  onDeactivate(context: SceneActivationContext) {
    this.entities.forEach(ent => {
      ent.kill();
    });
  }

  // Display the start button after resources are loaded
  showPlayButton(): Promise<void> {
    return new Promise(resolve => {
      //get button from scene
      this.createButtons();
      if (!this.label) return;
      this.label.setText("Click Play to Begin!");
      this.label.pos.x = 250;
      resolve();
    });
  }

  // Handle post-load transitions
  public onAfterLoad(_loaded: Loadable<any>[], isInitialLoad: boolean): Promise<void> {
    return new Promise(async resolve => {
      if (isInitialLoad) {
        await this.showPlayButton();
      } else {
        Util.delay(1000, this.engine?.clock).then(() => {
          this.engine?.goToScene("main");
        });
      }
      resolve();
    });
  }

  // Update progress bar during loading
  onPreUpdate(engine: Engine, elapsed: number): void {
    if (this.pbar) {
      const percent = this.progress;
      this.pbar.value = percent * 100;
    }
  }
}
