export type Brick = {
  x: number;
  y: number;
  width: number;
  height: number;
  startColor: string;
};

// Array of colors in shape [brickIndex: color]
export type BricksColors = string[];
