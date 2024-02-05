import { Rect } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { Brick as BrickType, BricksColors } from "./types";

const Brick = ({
  brickIndex,
  brick,
  bricksColors,
}: {
  brickIndex: number;
  brick: BrickType;
  bricksColors: SharedValue<BricksColors>;
}) => {
  const colors = useDerivedValue(() => {
    return bricksColors.value[brickIndex];
  });

  return (
    <Rect
      x={brick.x}
      y={brick.y}
      width={brick.width}
      height={brick.height}
      color={colors}
    />
  );
};

export const Bricks = ({
  bricks,
  bricksColors,
}: {
  bricks: BrickType[];
  bricksColors: SharedValue<BricksColors>;
}) => {
  const brickViews = bricks.map((brick, index) => {
    return (
      <Brick
        key={index}
        brickIndex={index}
        brick={brick}
        bricksColors={bricksColors}
      />
    );
  });

  return <>{brickViews}</>;
};
