import { Canvas } from "@shopify/react-native-skia";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ball } from "./Ball";
import { Bricks } from "./Bricks";
import { Score } from "./Score";
import {
  BRICK_SIZE,
  COLORS,
  NUM_BRICKS_PER_ROW,
  NUM_OF_ROWS,
  SCREEN_HEIGHT,
} from "./constants";
import { Brick, BricksColors } from "./types";

let bricks: Brick[] = [];
for (let row = 0; row < NUM_OF_ROWS; row++) {
  for (let col = 0; col < NUM_BRICKS_PER_ROW; col++) {
    let color = row > NUM_OF_ROWS / 2 ? COLORS.COLOR2 : COLORS.COLOR1;
    // If there is an even number of rows, we want split the colors evenly in this one row
    if (row === Math.floor(NUM_OF_ROWS / 2)) {
      color = col > NUM_BRICKS_PER_ROW / 2 ? COLORS.COLOR2 : COLORS.COLOR1;
    }
    bricks.push({
      x: col * BRICK_SIZE,
      y: row * BRICK_SIZE,
      width: BRICK_SIZE,
      height: BRICK_SIZE,
      startColor: color,
    });
  }
}

const defaultBricksColors = bricks.map((brick) => brick.startColor);
const CENTER_Y = SCREEN_HEIGHT / 2;

export const Game = () => {
  const bricksColors = useSharedValue<BricksColors>(defaultBricksColors);
  const { top: topOffset, bottom: bottomOffset } = useSafeAreaInsets();
  return (
    <>
      <StatusBar style="auto" />
      <Canvas style={styles.container}>
        <Bricks bricks={bricks} bricksColors={bricksColors} />

        <Ball
          color={COLORS.COLOR1}
          brickColor={COLORS.COLOR2}
          bricks={bricks}
          bricksColors={bricksColors}
          startY={CENTER_Y + CENTER_Y / 2}
          startDy={-10}
          startDx={10}
        />
        <Ball
          color={COLORS.COLOR2}
          brickColor={COLORS.COLOR1}
          bricks={bricks}
          bricksColors={bricksColors}
          startY={CENTER_Y - CENTER_Y / 2}
          startDy={10}
          startDx={-10}
        />

        <Score
          y={topOffset + 45}
          bricksColors={bricksColors}
          color={COLORS.COLOR2}
        />
        <Score
          y={SCREEN_HEIGHT - 45 - bottomOffset}
          bricksColors={bricksColors}
          color={COLORS.COLOR1}
        />
      </Canvas>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
