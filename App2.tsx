import { SafeAreaProvider } from "react-native-safe-area-context";
import { Game } from "./src/Game";

export default function App() {
  return (
    <SafeAreaProvider>
      <Game />
    </SafeAreaProvider>
  );
}
