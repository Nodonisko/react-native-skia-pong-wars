import {
  SharedValue,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { Canvas, Circle, Rect } from "@shopify/react-native-skia";

export type PlatformDefinition = {
  x: number;
  y: number;
};

export const PLATFORM_HEIGHT = 10;
export const PLATFORM_WIDTH = 100;

export const Platform = ({
  platformDefinition,
}: {
  platformDefinition: SharedValue<PlatformDefinition>;
}) => {
  const y = useDerivedValue(() => platformDefinition.value.y);
  const x = useDerivedValue(() => platformDefinition.value.x);

  return (
    <Rect
      x={x}
      y={y}
      width={PLATFORM_WIDTH}
      height={PLATFORM_HEIGHT}
      color="#000000"
    />
  );
};
