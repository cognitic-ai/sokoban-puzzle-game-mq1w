import { View } from "react-native";
import SokobanGame from "@/components/sokoban-game";
import levelsData from "../../levels.json";

export default function IndexRoute() {
  return (
    <View style={{ flex: 1 }}>
      <SokobanGame levels={levelsData.levels} />
    </View>
  );
}
