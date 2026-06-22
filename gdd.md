````markdown
# Machine Repairman

## Game Jam Design Document

**Theme:** Spin to Win  
**Genre:** Picture Puzzle / Tile Rotation Puzzle  
**Scope:** 7-Day Solo Game Jam

---

# High Concept

You are a machine repair technician responsible for restoring malfunctioning machines.

Each machine arrives damaged and misaligned. The machine's blueprint image has been fragmented into puzzle tiles, with pieces shuffled
and rotated.

To repair the machine, the player must:

- Move tiles into their correct positions
- Rotate tiles into their correct orientations

Once every piece is correctly positioned and aligned, the machine powers on and the repair is complete.

The game's interpretation of **"Spin to Win"** is literal: rotating puzzle pieces is a core mechanic required to solve every machine.

---

# Core Gameplay Loop

1. Receive repair job
2. View damaged machine
3. Rearrange puzzle pieces
4. Rotate pieces into correct alignment
5. Complete repair
6. Watch machine power up
7. Move to next repair job

---

# Core Systems

## Puzzle System

Responsible for:

- Loading machine images
- Dividing images into tiles
- Tracking tile positions
- Tracking tile rotations
- Detecting puzzle completion

### Tile Data

```ts
interface TileData {
  id: number;

  correctX: number;
  correctY: number;

  currentX: number;
  currentY: number;

  rotation: number; // 0, 90, 180, 270
}
```

---

## Tile Interaction System

Handles player interaction with puzzle pieces.

### Select Tile

Player clicks or taps a tile.

### Move Tile

#### Recommended MVP: Tile Swapping

1. Select tile A
2. Select tile B
3. Swap positions

Benefits:

- Simple implementation
- Mobile friendly
- Faster to polish

#### Optional Stretch Goal: Drag and Drop

Allows tiles to be dragged into place.

---

## Rotation System

Primary mechanic supporting the jam theme.

### Rotation Controls

Possible options:

- Right click
- Double click
- Rotate button
- Keyboard shortcut

### Rotation States

```text
0°
90°
180°
270°
```

Rotations occur in 90-degree increments.

---

## Win Detection System

A tile is considered correct when:

```ts
currentX === correctX && currentY === correctY && rotation === 0;
```

The puzzle is solved when all tiles meet these conditions.

### Puzzle Solved Event

```ts
PuzzleSolved;
```

Triggers:

- Machine startup animation
- Completion screen
- Score calculation
- Next level unlock

---

# Scrambling System

Generates puzzle layouts.

---

## Position Shuffle

Randomizes tile positions.

Example:

```text
A B C

becomes

C A B
```

---

## Rotation Shuffle

Applies random rotations to tiles.

Possible values:

```text
0°
90°
180°
270°
```

---

# Difficulty System

## Easy

- Small grid
- Position shuffle only

### Example

```text
2x2
```

---

## Medium

- Larger grid
- Position shuffle
- Rotation shuffle

### Example

```text
3x3
```

---

## Hard

- Large grid
- Position shuffle
- Rotation shuffle

### Example

```text
4x4
5x5
```

---

# Repair Theme Systems

These systems reinforce the machine repair fantasy.

---

## Repair Progress Meter

Displays repair completion percentage.

Example:

```text
Repair Progress

█████░░░░░ 50%
```

Possible calculation:

- 50% position accuracy
- 50% rotation accuracy

---

## Diagnostic Screen

Before each level:

```text
FAULT DETECTED

Hydraulic Press #4

Alignment Error: 72%
```

Adds narrative flavor while remaining lightweight.

---

## Machine Startup Sequence

Triggered after puzzle completion.

Examples:

```text
SYSTEM ONLINE
```

Visual effects:

- Indicator lights activate
- Gears begin spinning
- Energy pulses
- Success sound effects

Creates a satisfying reward moment.

---

# Hint System

Optional quality-of-life feature.

---

## Reveal Tile

Places one tile correctly.

Penalty:

- Reduced score
- Added time

---

## Blueprint Flash

Temporarily displays the completed image.

Example:

```text
Show for 2 seconds
```

Then return to puzzle view.

---

# Scoring System

Optional system for replayability.

---

## Time Bonus

```ts
score += max(0, targetTime - elapsedTime);
```

---

## Rotation Efficiency

Track total rotations used.

Fewer rotations increase score.

---

## Hint Penalty

Using hints reduces final score.

---

# Progression

Recommended progression path.

| Level | Grid Size | Rotation |
| ----- | --------- | -------- |
| 1     | 2x2       | No       |
| 2     | 3x3       | No       |
| 3     | 3x3       | Yes      |
| 4     | 4x4       | Yes      |
| 5     | 5x5       | Yes      |

---

# Visual Themes

Machine images can belong to different categories.

---

## Industrial

- Hydraulic presses
- Conveyor systems
- Generators
- Gearboxes

---

## Steam Powered

- Boilers
- Steam engines
- Turbines

---

## Robotics

- Assembly robots
- Automated machinery
- Factory equipment

---

## Sci-Fi

- Reactors
- Warp drives
- AI cores
- Energy generators

---

# Audio Direction

### Ambient

- Factory hum
- Mechanical noises

### Interaction

- Tile click
- Tile swap
- Rotation click

### Success

- Startup sequence
- Power-up sounds
- Mechanical activation

---

# User Interface

## Main Menu

- Start Repairs
- Level Select
- Credits

---

## Puzzle Screen

Displays:

- Puzzle board
- Repair progress
- Timer
- Restart button
- Hint button

---

## Completion Screen

Displays:

- Repair complete message
- Time
- Score
- Continue button

---

# MVP Scope

The minimum version required to ship the game jam entry.

## Required Systems

- Puzzle generation
- Tile swapping
- Tile rotation
- Win detection
- Level loading
- Timer

## Required Content

- 5 machine images
- Basic UI
- Completion screen

## Success Criteria

A player can:

1. Start a level
2. Rearrange puzzle pieces
3. Rotate puzzle pieces
4. Solve the machine
5. Progress to another level

---

# Stretch Goals

If time permits:

- Drag-and-drop movement
- Animated machine startup sequences
- Hint system
- Repair scoring
- Achievement medals
- Daily challenge mode
- Procedural machine generation
- Endless repair mode

---

# Development Priorities

## Day 1

- Puzzle board
- Tile rendering

## Day 2

- Tile swapping
- Rotation system

## Day 3

- Win detection
- Puzzle scrambling

## Day 4

- Level progression
- UI

## Day 5

- Visual polish
- Sound effects

## Day 6

- Additional content
- Balancing

## Day 7

- Bug fixing
- Juice and polish
- Final build submission

---

# Elevator Pitch

_"Repair broken machines by rotating and repositioning scrambled components. Solve picture puzzles, restore complex machinery, and
literally spin your way to victory in this machine repair puzzle game built around the theme: Spin to Win."_
````
