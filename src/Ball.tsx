import { Circle } from "@shopify/react-native-skia";
import {
  SharedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { Brick, BricksColors } from "./types";
import { BALL_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH, SPEED } from "./constants";

const CENTER_X = SCREEN_WIDTH / 2;

export function Ball({
  color,
  brickColor,
  bricks,
  bricksColors,
  startY,
  startDx,
  startDy,
}: {
  color: string;
  brickColor: string;
  bricks: Brick[];
  bricksColors: SharedValue<BricksColors>;
  startY: number;
  startDx: number;
  startDy: number;
}) {
  const x = useSharedValue(CENTER_X);
  const y = useSharedValue(startY);
  const dx = useSharedValue(startDx);
  const dy = useSharedValue(startDy);

  const frameCallback = useFrameCallback((frameInfo) => {
    const { timeSincePreviousFrame: dt } = frameInfo;
    if (dt == null) {
      return;
    }

    // Check if the ball hits the left or right walls
    if (
      x.value + dx.value > SCREEN_WIDTH - BALL_SIZE / 2 ||
      x.value + dx.value < BALL_SIZE / 2
    ) {
      dx.value = dx.value * -1;
    }

    // Check if the ball hits the top or bottom walls
    if (
      y.value + dy.value > SCREEN_HEIGHT - BALL_SIZE / 2 ||
      y.value + dy.value < BALL_SIZE / 2
    ) {
      dy.value = dy.value * -1;
    }

    x.value += dx.value * dt * SPEED;
    y.value += dy.value * dt * SPEED;

    // Enhanced collision response
    for (let index = 0; index < bricks.length; index++) {
      const brick = bricks[index];
      const currentBrickColor = bricksColors.value[index];

      // Check for collision
      if (
        currentBrickColor !== brickColor &&
        x.value + BALL_SIZE > brick.x &&
        x.value - BALL_SIZE < brick.x + brick.width &&
        y.value + BALL_SIZE > brick.y &&
        y.value - BALL_SIZE < brick.y + brick.height
      ) {
        // Determine the side of collision
        const overlapLeft = x.value + BALL_SIZE - brick.x;
        const overlapRight = brick.x + brick.width - (x.value - BALL_SIZE);
        const overlapTop = y.value + BALL_SIZE - brick.y;
        const overlapBottom = brick.y + brick.height - (y.value - BALL_SIZE);

        // Find the minimum overlap
        const minOverlap = Math.min(
          overlapLeft,
          overlapRight,
          overlapTop,
          overlapBottom
        );

        // Reflect ball based on the minimal overlap side
        if (minOverlap === overlapLeft || minOverlap === overlapRight) {
          dx.value = -dx.value; // Reflect horizontally
        } else {
          dy.value = -dy.value; // Reflect vertically
        }

        // Change brick color on hit
        const newBricksColors = [...bricksColors.value];
        newBricksColors[index] = brickColor;
        bricksColors.value = newBricksColors;
        break; // Exit loop after handling collision to avoid multiple collisions in one frame
      }
    }
  });

  return <Circle cx={x} cy={y} r={BALL_SIZE} color={color} />;
}
