import { View, Dimensions, Button } from "react-native";
import { useFrameCallback, useSharedValue } from "react-native-reanimated";
import { Canvas, Circle, Rect } from "@shopify/react-native-skia";
import { useAnimatedSensor, SensorType } from "react-native-reanimated";
import { useState } from "react";
import { PLATFORM_HEIGHT, PLATFORM_WIDTH, Platform } from "./srcJump/Platform";

// sprites
// https://craftpix.net/product/jump-game-kit/

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const BALL_RADIUS = 20;
const BALL_COLOR = "#ADD8E6";
const BALL_VELOCITY = 0;
const DEFAULT_BOUNCE_VELOCITY = -0.7; // Adjust this value based on desired bounce height

const BALL_GRAVITY = 1 / 1000;
const BALL_ELASTICITY = 1;

const PLATFORM_COLOR = "#000000";

const defaultColors = new Array(10).fill(0).map((_, i) => "#ADD8E6");

const defaultPlatforms = new Array(10).fill(0).map((_, i) => {
  return {
    x: Math.random() * SCREEN_WIDTH,
    y: Math.random() * SCREEN_HEIGHT,
  };
});

export default function App() {
  const x = useSharedValue(SCREEN_WIDTH / 2);
  const y = useSharedValue(SCREEN_HEIGHT / 2);
  const velocityY = useSharedValue(BALL_VELOCITY);
  const [sensorInt, setSensorInt] = useState(2000);
  const deviceRollSensor = useAnimatedSensor(SensorType.ROTATION);
  const deviceGyroSensor = useAnimatedSensor(SensorType.GYROSCOPE);
  const prevMaxY = useSharedValue(SCREEN_HEIGHT / 2);

  const platforms = defaultPlatforms.map((platform) =>
    useSharedValue(platform),
  );

  console.log("blah4");
  useFrameCallback((frameInfo) => {
    const perf = performance.now();
    const { timeSincePreviousFrame: dt } = frameInfo;
    if (dt == null) {
      return;
    }

    velocityY.value += BALL_GRAVITY * dt;
    if (!(velocityY.value < 0 && y.value < SCREEN_HEIGHT / 2)) {
      y.value += velocityY.value * dt;
    }

    // Bounce off the floor
    if (y.value > SCREEN_HEIGHT - BALL_RADIUS) {
      y.value = SCREEN_HEIGHT - BALL_RADIUS;
      velocityY.value = DEFAULT_BOUNCE_VELOCITY;
    }

    platforms.forEach((platform) => {
      // Bounce off the platform
      if (
        y.value + BALL_RADIUS >= platform.value.y &&
        y.value - BALL_RADIUS <= platform.value.y + PLATFORM_HEIGHT
      ) {
        if (
          x.value + BALL_RADIUS > platform.value.x &&
          x.value - BALL_RADIUS < platform.value.x + PLATFORM_WIDTH
        ) {
          if (velocityY.value > 0) {
            // Ensures ball is moving downwards
            y.value = platform.value.y - BALL_RADIUS;
            // Bounce off the platform and reset the velocity
            velocityY.value = DEFAULT_BOUNCE_VELOCITY;
          }
        }
      }

      // Move the platform down if the ball is moving up and is in the upper half of the screen
      if (velocityY.value < 0 && y.value < SCREEN_HEIGHT / 2) {
        //platformY.value += Math.abs(velocityY.value * dt); // Move platform down at a rate that complements the ball's upward movement
        // console.log(prevMaxY.value, y.value, prevMaxY.value - y.value);

        platform.value = {
          y: platform.value.y + Math.abs(velocityY.value * dt),
          x: platform.value.x,
        };
      }

      // Teleport the platform to the top if it reaches the bottom
      if (platform.value.y > SCREEN_HEIGHT) {
        platform.value = {
          y: -PLATFORM_HEIGHT,
          x: Math.random() * SCREEN_WIDTH,
        };
      }
    });

    const deviceRoll = deviceRollSensor.sensor.value.roll;
    const deviceGyro = deviceGyroSensor.sensor.value.y;

    x.value += deviceGyro;
    x.value += deviceRoll * 10;

    // teleport the ball to the other side of the screen
    if (x.value < 0) {
      x.value = SCREEN_WIDTH;
    } else if (x.value > SCREEN_WIDTH) {
      x.value = 0;
    }

    if (prevMaxY.value < y.value) {
      // console.log("setting prevMaxY to ", y.value);
      // console.log("y above half screen", y.value - SCREEN_HEIGHT / 2);
      prevMaxY.value = y.value;
    }

    // console.log(velocityY.value)
    // console.log("PERF: ", performance.now() - perf);
  });

  return (
    <Canvas style={{ flex: 1 }}>
      {platforms.map((platform, i) => (
        <Platform platformDefinition={platform} key={i} />
      ))}
      <Circle cx={x} cy={y} r={BALL_RADIUS} color="#ADD8E6" />
    </Canvas>
  );
}
