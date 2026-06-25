import { ImageSource, Sprite, Random } from "excalibur";
import { Resources } from "../resources";

type CellRole = "base" | "machine" | "empty" | "support_leg" | "floor";
type InteriorComponents =
  | "screen"
  | "guage"
  | "gear"
  | "vent"
  | "bolt2"
  | "bolts4"
  | "smallgear"
  | "gears"
  | "goldpipes"
  | "ironpipes"
  | "indicators"
  | "sliders"
  | "lever"
  | "levers"
  | "piston"
  | "pulley"
  | "pipes";

const panelSprites: ImageSource[] = [
  Resources.bolts2,
  Resources.bolts4,
  Resources.gear,
  Resources.goldpipes,
  Resources.ironpipes,
  Resources.indicators,
  Resources.sliders,
  Resources.lever,
  Resources.levers,
  Resources.monitor,
  Resources.panelGauge,
  Resources.piston,
  Resources.pulley,
  Resources.smallgear,
  Resources.smallgear2,
  Resources.vent,
];

const standSprites: ImageSource[] = [Resources.lamp, Resources.lamp2, Resources.standGauge, Resources.steam];

type TileCoords = {
  x: number;
  y: number;
};

const DEFAULT_TILE: TileCoords = {
  x: 0,
  y: 0,
};

const TILE_LOOKUP = new Map<number, TileCoords>([
  // isolated
  [0, { x: 1, y: 3 }],

  // single sides
  [1, { x: 2, y: 3 }], // U
  [4, { x: 0, y: 0 }], // R   // NO DOWN
  [16, { x: 0, y: 3 }], // D
  [64, { x: 0, y: 0 }], // L  // NO DOWN

  // outside corners
  [1 | 4, { x: 0, y: 0 }], // U R // NO DOWN
  [4 | 16, { x: 1, y: 1 }], // R D
  [16 | 64, { x: 1, y: 2 }], // D L
  [64 | 1, { x: 0, y: 0 }], // L U  // NO DOWN

  // straight edges
  [1 | 16, { x: 0, y: 2 }], // U D
  [4 | 64, { x: 0, y: 0 }], // R L  // NO DOWN
  [1 | 16 | 32, { x: 0, y: 2 }], // U D
  [1 | 16 | 8, { x: 0, y: 2 }], // U D
  [1 | 2 | 16 | 8, { x: 0, y: 2 }], // U D

  // T-junctions
  [1 | 4 | 16, { x: 0, y: 0 }], //t-right
  [4 | 16 | 64, { x: 0, y: 0 }], //t-left
  [16 | 64 | 1, { x: 0, y: 0 }], // NO DOWN
  [64 | 1 | 4, { x: 5, y: 2 }], //t-up

  // all four sides, no corners
  [1 | 4 | 16 | 64, { x: 0, y: 0 }], //cross

  // ---- U+R corner variations ----
  [1 | 4 | 2, { x: 0, y: 0 }], // U R UR // NO DOWN

  // ---- R+D ----
  [4 | 16 | 8, { x: 1, y: 1 }], // R D BR

  // ---- D+L ----
  [16 | 64 | 32, { x: 1, y: 2 }], // D L BL

  // ---- L+U ----
  [64 | 1 | 128, { x: 0, y: 0 }], // NO DOWN

  // ---- T right ----
  [1 | 4 | 16 | 2, { x: 1, y: 2 }], //U R D
  [1 | 4 | 16 | 8, { x: 5, y: 1 }],
  [1 | 4 | 16 | 2 | 8, { x: 1, y: 2 }],

  // ---- T down ----
  [4 | 16 | 64 | 8, { x: 3, y: 1 }],
  [4 | 16 | 64 | 32, { x: 3, y: 1 }],
  [4 | 16 | 64 | 8 | 32, { x: 3, y: 1 }],

  // ---- T left ----
  [16 | 64 | 1 | 32, { x: 4, y: 1 }],
  [16 | 64 | 1 | 128, { x: 2, y: 2 }],
  [16 | 64 | 1 | 32 | 128, { x: 2, y: 2 }],

  // ---- T up ----
  [64 | 1 | 4 | 128, { x: 0, y: 0 }],
  [64 | 1 | 4 | 2, { x: 0, y: 0 }],
  [64 | 1 | 4 | 128 | 2, { x: 0, y: 0 }],

  // ---- center variations ----
  [1 | 4 | 16 | 64 | 2, { x: 3, y: 2 }],
  [1 | 4 | 16 | 64 | 8, { x: 0, y: 0 }], //NA
  [1 | 4 | 16 | 64 | 32, { x: 0, y: 0 }], //NA
  [1 | 4 | 16 | 64 | 128, { x: 4, y: 2 }],

  [1 | 4 | 16 | 64 | 2 | 8, { x: 3, y: 2 }],
  [1 | 4 | 16 | 64 | 8 | 32, { x: 5, y: 2 }],
  [1 | 4 | 16 | 64 | 32 | 128, { x: 4, y: 2 }],
  [1 | 4 | 16 | 64 | 128 | 2, { x: 0, y: 0 }], //NA

  [1 | 4 | 16 | 64 | 2 | 32, { x: 3, y: 2 }],
  [1 | 4 | 16 | 64 | 8 | 128, { x: 4, y: 2 }],

  [1 | 4 | 16 | 64 | 2 | 8 | 32, { x: 3, y: 2 }],
  [1 | 4 | 16 | 64 | 8 | 32 | 128, { x: 4, y: 2 }],
  [1 | 4 | 16 | 64 | 32 | 128 | 2, { x: 0, y: 0 }],
  [1 | 4 | 16 | 64 | 128 | 2 | 8, { x: 0, y: 0 }],

  [1 | 4 | 16 | 64 | 2 | 8 | 32 | 128, { x: 0, y: 4 }],
  [4 | 16 | 64 | 2 | 8 | 32 | 128, { x: 3, y: 1 }],

  // random missed tiles
  [1 | 8 | 16 | 32 | 64, { x: 4, y: 1 }],
  [1 | 4 | 8 | 16 | 32, { x: 5, y: 1 }],
  [255, { x: 0, y: 0 }],
  [24, { x: 0, y: 3 }],
  [126, { x: 3, y: 1 }],
  [177, { x: 0, y: 2 }],
  [81, { x: 4, y: 1 }],
  [48, { x: 0, y: 3 }],
  [238, { x: 3, y: 1 }],
  [216, { x: 2, y: 1 }],
  [109, { x: 5, y: 2 }],
  [240, { x: 2, y: 1 }],
  [225, { x: 2, y: 2 }],
  [190, { x: 1, y: 1 }],
  [15, { x: 1, y: 2 }],
  [30, { x: 1, y: 1 }],
  [9, { x: 0, y: 2 }],
  [59, { x: 0, y: 2 }],
  [110, { x: 3, y: 1 }],
  [61, { x: 5, y: 1 }],
  [191, { x: 1, y: 2 }],
  [176, { x: 0, y: 3 }],
  [224, { x: 2, y: 1 }],
  [21, { x: 5, y: 1 }],
  [250, { x: 2, y: 1 }],
  [104, { x: 2, y: 1 }],
  [251, { x: 2, y: 2 }],
  [249, { x: 2, y: 2 }],
  [248, { x: 2, y: 1 }],
  [63, { x: 1, y: 2 }],
  [60, { x: 1, y: 1 }],
  [112, { x: 2, y: 1 }],
  [252, { x: 3, y: 1 }],
  [57, { x: 0, y: 2 }],
  [56, { x: 0, y: 3 }],
  [62, { x: 1, y: 1 }],
  [120, { x: 2, y: 1 }],
]);

type GridData = {
  role: CellRole;
  col: number;
  row: number;
  components?: ImageSource;
};

type NeighborMap = {
  up?: GridData;
  down?: GridData;
  left?: GridData;
  right?: GridData;
};

type Neighbor8Map = {
  up?: GridData;
  upRight?: GridData;
  right?: GridData;
  downRight?: GridData;
  down?: GridData;
  downLeft?: GridData;
  left?: GridData;
  upLeft?: GridData;
};

enum NeighborMask {
  Up = 1,
  UpRight = 2,
  Right = 4,
  DownRight = 8,
  Down = 16,
  DownLeft = 32,
  Left = 64,
  UpLeft = 128,
}

export class MachineGeneration {
  static async generateImage(): Promise<Sprite> {
    let rng = new Random();
    // setup and creation

    const cnv = document.createElement("canvas");
    cnv.width = 500;
    cnv.height = 500;
    const ctx = cnv.getContext("2d");

    // #region bground
    // Draw background
    let backgroundimage = Resources.background.image;
    if (!ctx) throw new Error("bad canvas ctx");
    ctx.drawImage(backgroundimage, 0, 0);

    const grid: GridData[][] = Array.from({ length: 10 }, (_, row) =>
      Array.from({ length: 10 }, (_, col) => ({
        role: "empty",
        col,
        row,
      })),
    );
    let machineGrid = new MachineGrid(grid);
    // #endregion bground

    // #region floor
    // Build floor
    for (let i = 0; i < 10; i++) {
      let cData = machineGrid.getCell(9, i);
      if (!cData) throw new Error("bad cell");
      cData.role = "floor";
    }

    // #endregion floor

    // #region base
    // Build machine base
    let numBaseTiles = rng.integer(8, 10);
    numBaseTiles = 10;
    let freespaces = 10 - numBaseTiles;
    // start assigning floortiles based on num and freespaces
    let startingpoint = rng.integer(0, freespaces);
    let loopIndex = startingpoint;

    for (let i = 0; i < numBaseTiles; i++) {
      let cData = machineGrid.getCell(8, loopIndex);
      if (!cData) throw new Error("bad cell");
      cData.role = "base";
      loopIndex++;
    }

    // #endregion base

    // #region heights
    // determine machine height for each base tile
    let heights = Array.from({ length: numBaseTiles }, () => {
      return rng.integer(3, 8);
    });
    // #endregion heights

    // #region machine shape
    // set machine panel data for each cell
    loopIndex = startingpoint;
    for (let height of heights) {
      let innerLoopIndex = 7;
      //   debugger;
      for (let i = 0; i < height; i++) {
        // inc for each height
        let cData = machineGrid.getCell(innerLoopIndex, loopIndex);
        if (!cData) throw new Error("bad cell");
        cData.role = "machine";
        innerLoopIndex--;
      }
      loopIndex++;
    }

    // #endregion machine shape

    // #region detect exterior tiles
    //**** Exterior tile detection */
    // set machine panel data for each cell
    loopIndex = startingpoint;
    for (let height of heights) {
      let innerLoopIndex = 7;
      //   debugger;
      for (let i = 0; i < height; i++) {
        // inc for each height
        let cData = machineGrid.getCell(innerLoopIndex, loopIndex);
        if (!cData) throw new Error("bad cell");
        let neighbors = machineGrid.getNeighbors(innerLoopIndex, loopIndex);
        const neighborArray = [neighbors.up, neighbors.down, neighbors.left, neighbors.right].filter(
          (n): n is GridData => n !== undefined,
        );

        if (neighborArray.some(neighbor => neighbor.role === "empty") || neighborArray.length < 4) {
          cData.role = "machine";
        }
        innerLoopIndex--;
      }
      loopIndex++;
    }
    // #endregion detect exterior tiles

    // #region supportLegs

    //for each row, determine if there's a support leg
    let supportX = startingpoint;
    let supportY = 7;

    let supportLegsCoords: TileCoords[] = [];

    heights.forEach((height, index) => {
      let rslt = rng.integer(0, 10);
      if (rslt < 4 && height > 2) {
        // make a cell in that column a support leg
        let spotIndex = rng.integer(0, height - 2);
        let cData = machineGrid.getCell(supportY - spotIndex, supportX + index);
        if (!cData) throw new Error("bad cell");
        supportLegsCoords.push({ x: supportX + index, y: supportY - spotIndex });
      }
    });
    //#endregion supportLegs

    // #region interior components

    machineGrid.forEachCell(cell => {
      if (cell.role != "empty" && cell.role != "floor") {
        let rslt = rng.integer(0, 10);
        if (rslt < 7) {
          //assign an interior component
          let component = rng.pickOne(panelSprites) as ImageSource;
          cell.components = component;
        }
      }
    });

    // #endregion interior components

    // #region exterior components

    supportX = startingpoint;
    supportY = 7;
    let exteriorComponents: TileCoords[] = [];
    heights.forEach((height, index) => {
      let coinFlip = rng.bool();
      if (coinFlip) {
        exteriorComponents.push({ x: supportX + index, y: supportY - height });
      }
    });

    // #endregion exterior components

    // draw the machine
    machineGrid.draw(ctx);
    machineGrid.drawSupportLegs(ctx, supportLegsCoords);
    machineGrid.drawComponentTopper(ctx, exteriorComponents, rng);

    // return the image
    let imgSource = new ImageSource(cnv.toDataURL());
    await imgSource.load();
    let sprite: Sprite = new Sprite({ image: imgSource });
    return sprite;
  }
}

class MachineGrid {
  constructor(
    public readonly cells: GridData[][],
    public readonly cellSize = 50,
  ) {}
  isValidCell(row: number, col: number): boolean {
    return row >= 0 && row < this.cells.length && col >= 0 && col < this.cells[row].length;
  }

  get(row: number, col: number): GridData | undefined {
    return this.cells[row]?.[col];
  }

  draw(cnv: CanvasRenderingContext2D): void {
    for (let row = 0; row < this.cells.length; row++) {
      for (let col = 0; col < this.cells[row].length; col++) {
        this.drawCell(cnv, row, col);
        this.drawComponent(cnv, row, col);
      }
    }
  }

  grabTileFromTileset(tileset: HTMLImageElement, x: number, y: number, tileSize = 50): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = tileSize;
    canvas.height = tileSize;

    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      tileset,
      x * tileSize, // source x
      y * tileSize, // source y
      tileSize, // source width
      tileSize, // source height
      0, // destination x
      0, // destination y
      tileSize,
      tileSize,
    );

    return canvas;
  }

  drawCell(cnv: CanvasRenderingContext2D, row: number, col: number): void {
    const cell = this.get(row, col);
    if (!cell) {
      return;
    }

    let tileset = Resources.tilset.image;
    const x = col * this.cellSize;
    const y = row * this.cellSize;
    // let neighbors = this.getNeighborMap(row, col);
    // let n = this.getNeighborMap(row, col);
    // let up = connected(n.up);
    // let upRight = connected(n.upRight);
    // let right = connected(n.right);
    // let downRight = connected(n.downRight);
    // let down = connected(n.down);
    // let downLeft = connected(n.downLeft);
    // let left = connected(n.left);
    // let upLeft = connected(n.upLeft);
    let tileX = 0;
    let tileY = 0;

    const n = this.getNeighborMap(row, col);
    const mask = this.getNeighborMask(row, col);

    let tilecoords;
    let sprite;
    switch (cell.role) {
      case "empty":
        cnv.fillStyle = "#000000";
        break;

      case "base":
        const base_tile_lookup = new Map<number, TileCoords>([
          [0, { x: 1, y: 3 }],
          [1, { x: 2, y: 3 }],
          [1 | 4, { x: 3, y: 3 }],
          [1 | 16, { x: 4, y: 3 }],
          [62, { x: 3, y: 3 }],
          [63, { x: 3, y: 3 }],
          [30, { x: 3, y: 3 }],
          [255, { x: 5, y: 3 }],
          [253, { x: 5, y: 3 }],
          [254, { x: 5, y: 3 }],
          [249, { x: 4, y: 3 }],
          [248, { x: 4, y: 3 }],
          [241, { x: 4, y: 3 }],
          [127, { x: 6, y: 3 }],
          [113, { x: 4, y: 3 }],
          [125, { x: 5, y: 3 }],
          [252, { x: 5, y: 3 }],
          [126, { x: 5, y: 3 }],
          [31, { x: 3, y: 3 }],
        ]);
        tilecoords = base_tile_lookup.get(mask) ?? DEFAULT_TILE;
        sprite = this.grabTileFromTileset(tileset, tilecoords.x, tilecoords.y);
        cnv.drawImage(sprite, x, y);
        break;

      case "machine":
        tilecoords = TILE_LOOKUP.get(mask) ?? DEFAULT_TILE;
        sprite = this.grabTileFromTileset(tileset, tilecoords.x, tilecoords.y);
        cnv.drawImage(sprite, x, y);
        break;

      case "support_leg":
        const supportTile = this.grabTileFromTileset(tileset, 5, 0);
        cnv.drawImage(supportTile, x, y);
        break;

      case "floor":
        break;
    }
  }

  drawSupportLegs(cnv: CanvasRenderingContext2D, slCoords: TileCoords[]) {
    let tileset = Resources.tilset.image;
    let bground = Resources.background.image;

    slCoords.forEach(cell => {
      //grab proper tile, either
      let tile;
      const x = cell.x * this.cellSize;
      const y = cell.y * this.cellSize;

      let neighbors = this.getNeighbors(cell.y, cell.x);

      if (neighbors.left && neighbors.left.role != "empty" && neighbors.right && neighbors.right.role != "empty") {
        //both
        tile = this.grabTileFromTileset(tileset, 8, 0);
      } else if ((neighbors.left?.role == "empty" || neighbors.left == undefined) && neighbors.right?.role != "empty") {
        //right panel
        tile = this.grabTileFromTileset(tileset, 9, 1);
      } else if (neighbors.left?.role != "empty" && (neighbors.right?.role == "empty" || neighbors.right == undefined)) {
        //left panel
        tile = this.grabTileFromTileset(tileset, 9, 0);
      } else {
        //no panel
        tile = this.grabTileFromTileset(tileset, 7, 0);
      }
      cnv.drawImage(bground, x, y, 50, 50, x, y, 50, 50);
      cnv.drawImage(tile, x, y);
    });
  }

  drawComponent(cnv: CanvasRenderingContext2D, row: number, col: number) {
    const cell = this.get(row, col);
    if (!cell) {
      return;
    }

    let tileset = Resources.tilset.image;
    const x = col * this.cellSize;
    const y = row * this.cellSize;
    if (!cell.components) return;
    let image = cell.components;
    cnv.drawImage(image.image, x, y);
  }

  drawComponentTopper(cnv: CanvasRenderingContext2D, exCompCoords: TileCoords[], rng: Random) {
    let tileset = Resources.tilset.image;
    let bground = Resources.background.image;

    exCompCoords.forEach(cell => {
      //grab proper tile, either
      let tile;
      const x = cell.x * this.cellSize;
      const y = cell.y * this.cellSize;
      tile = rng.pickOne(standSprites);
      if (tile != Resources.steam) cnv.drawImage(tile.image, x, y + 2);
      else cnv.drawImage(tile.image, x, y - 48);
    });
  }

  getCell(row: number, col: number): GridData | undefined {
    if (!this.isValidCell(row, col)) {
      return undefined;
    }
    return this.cells[row][col];
  }

  setRole(row: number, col: number, role: CellRole): boolean {
    const cell = this.getCell(row, col);
    if (!cell) {
      return false;
    }
    cell.role = role;
    return true;
  }

  setCell(row: number, col: number, data: Partial<Omit<GridData, "row" | "col">>): boolean {
    const cell = this.getCell(row, col);

    if (!cell) {
      return false;
    }

    Object.assign(cell, data);
    return true;
  }

  isRole(row: number, col: number, role: CellRole): boolean {
    return this.getCell(row, col)?.role === role;
  }

  forEachCell(callback: (cell: GridData) => void): void {
    for (const row of this.cells) {
      for (const cell of row) {
        callback(cell);
      }
    }
  }

  getNeighbors(row: number, col: number): NeighborMap {
    return {
      up: this.getCell(row - 1, col),
      down: this.getCell(row + 1, col),
      left: this.getCell(row, col - 1),
      right: this.getCell(row, col + 1),
    };
  }
  getNeighborMap(row: number, col: number): Neighbor8Map {
    return {
      up: this.getCell(row - 1, col),
      upRight: this.getCell(row - 1, col + 1),
      right: this.getCell(row, col + 1),
      downRight: this.getCell(row + 1, col + 1),
      down: this.getCell(row + 1, col),
      downLeft: this.getCell(row + 1, col - 1),
      left: this.getCell(row, col - 1),
      upLeft: this.getCell(row - 1, col - 1),
    };
  }

  private getMask(n: Neighbor8Map): number {
    let mask = 0;

    if (connected(n.up)) mask |= NeighborMask.Up;
    if (connected(n.upRight)) mask |= NeighborMask.UpRight;
    if (connected(n.right)) mask |= NeighborMask.Right;
    if (connected(n.downRight)) mask |= NeighborMask.DownRight;
    if (connected(n.down)) mask |= NeighborMask.Down;
    if (connected(n.downLeft)) mask |= NeighborMask.DownLeft;
    if (connected(n.left)) mask |= NeighborMask.Left;
    if (connected(n.upLeft)) mask |= NeighborMask.UpLeft;

    return mask;
  }

  private getNeighborMask(row: number, col: number): number {
    const n = this.getNeighborMap(row, col);

    return (
      (connected(n.up) ? 1 : 0) |
      (connected(n.upRight) ? 2 : 0) |
      (connected(n.right) ? 4 : 0) |
      (connected(n.downRight) ? 8 : 0) |
      (connected(n.down) ? 16 : 0) |
      (connected(n.downLeft) ? 32 : 0) |
      (connected(n.left) ? 64 : 0) |
      (connected(n.upLeft) ? 128 : 0)
    );
  }

  isSupportLegAbove(row: number, col: number): boolean {
    let up = this.getCell(row - 1, col);
    if (up && up.role == "support_leg") return true;
    return false;
  }
}

function connected(cell?: GridData): boolean {
  return cell !== undefined && cell.role !== "empty" && cell.role != "support_leg";
}
