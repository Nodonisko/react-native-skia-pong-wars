import { Text, matchFont } from "@shopify/react-native-skia";
import { Platform } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { SCREEN_WIDTH } from "./constants";
import { BricksColors } from "./types";

const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
const fontStyle = {
  fontFamily,
  fontSize: 24,
};
const font = matchFont(fontStyle);
export const Score = ({
  y,
  color,
  bricksColors,
}: {
  y: number;
  bricksColors: SharedValue<BricksColors>;
  color: string;
}) => {
  const scoreText = useDerivedValue(() => {
    return bricksColors.value.filter((c) => c === color).length.toString();
  });
  const x = useDerivedValue(() => {
    return SCREEN_WIDTH / 2 - font.measureText(scoreText.value).width / 2;
  });
  return <Text x={x} y={y} text={scoreText} font={font} />;
};
