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
import bigGear from "./Assets/gear.png";

// bgm
import gameLoop from "./Assets/torone-ecryme-generique-long-loop.ogg";
import endLoop from "./Assets/torone-ecryme-loop-04-dark-magic.mp3";

//procgen
import background from "./Assets/procgen/background.png";
import tileset from "./Assets/procgen/machine tileset.png";

//procgen accessories
import panelGauge from "./Assets/procgen/gauge_panel.png";
import standGauge from "./Assets/procgen/gauge_stand.png";
import bolts4 from "./Assets/procgen/bolt_pattern_4.png";
import bolts2 from "./Assets/procgen/bolt_pattern_2.png";
import gear from "./Assets/procgen/gear.png";
import smallgear from "./Assets/procgen/small gear.png";
import smallgear2 from "./Assets/procgen/two small gears.png";
import lamp from "./Assets/procgen/lamp.png";
import lamp2 from "./Assets/procgen/2lamps.png";
import monitor from "./Assets/procgen/monitor.png";
import lever from "./Assets/procgen/lever.png";
import levers from "./Assets/procgen/levers.png";
import pulley from "./Assets/procgen/pulley.png";
import vent from "./Assets/procgen/vent.png";
import piston from "./Assets/procgen/pistons.png";
import goldpipes from "./Assets/procgen/gold_pipes_two.png";
import ironpipes from "./Assets/procgen/ironpipes_two.png";
import indicators from "./Assets/procgen/indicators.png";
import sliders from "./Assets/procgen/sliders.png";
import steam from "./Assets/procgen/steam.png";

export const Resources = {
  bigGear: new ImageSource(bigGear),
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
  // procgen
  tilset: new ImageSource(tileset),
  background: new ImageSource(background),
  ironpipes: new ImageSource(ironpipes),
  goldpipes: new ImageSource(goldpipes),
  piston: new ImageSource(piston),
  vent: new ImageSource(vent),
  monitor: new ImageSource(monitor),
  pulley: new ImageSource(pulley),
  lever: new ImageSource(lever),
  levers: new ImageSource(levers),
  lamp: new ImageSource(lamp),
  lamp2: new ImageSource(lamp2),
  smallgear: new ImageSource(smallgear),
  smallgear2: new ImageSource(smallgear2),
  bolts2: new ImageSource(bolts2),
  bolts4: new ImageSource(bolts4),
  panelGauge: new ImageSource(panelGauge),
  standGauge: new ImageSource(standGauge),
  indicators: new ImageSource(indicators),
  sliders: new ImageSource(sliders),
  steam: new ImageSource(steam),
};

export const loader = new Loader();

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
