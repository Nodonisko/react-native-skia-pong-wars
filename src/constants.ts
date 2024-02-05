import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;

export const BRICK_SIZE = 20;
export const BALL_SIZE = 10;
export const SPEED = 0.045;

export const NUM_BRICKS_PER_ROW = SCREEN_WIDTH / BRICK_SIZE;
export const NUM_OF_ROWS = SCREEN_HEIGHT / BRICK_SIZE;

export const COLORS = {
  COLOR1: "#ADD8E6",
  COLOR2: "#5A5A5A",
};
