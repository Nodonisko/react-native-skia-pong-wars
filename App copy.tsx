import {
  SensorType,
  useAnimatedSensor,
  useFrameCallback,
} from "react-native-reanimated";

export default function App() {
  const deviceRollSensor = useAnimatedSensor(SensorType.ROTATION);
  const deviceGyroSensor = useAnimatedSensor(SensorType.GYROSCOPE);

  console.log("blah4");
  useFrameCallback((frameInfo) => {
    const deviceRoll = deviceRollSensor.sensor.value.roll;
    const deviceGyro = deviceGyroSensor.sensor.value.y;

    console.log("deviceRoll: ", deviceRoll);
    console.log("deviceGyro: ", deviceGyro);
  });

  return null;
}
