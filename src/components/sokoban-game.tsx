import { useState, useEffect } from "react";
import { View, Text, Pressable, useColorScheme } from "react-native";
import { systemBlue, systemGreen, systemRed, systemYellow, systemGray, label, secondaryLabel, systemBackground, secondarySystemBackground } from "@bacons/apple-colors";

type Cell = "#" | " " | "@" | "B" | "T" | "P" | "X";

interface Level {
  id: number;
  name: string;
  grid: Cell[][];
}

interface Position {
  row: number;
  col: number;
}

interface SokobanGameProps {
  levels: Level[];
}

export default function SokobanGame({ levels }: SokobanGameProps) {
  const colorScheme = useColorScheme();
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [moves, setMoves] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (levels.length > 0) {
      loadLevel(currentLevelIndex);
    }
  }, [currentLevelIndex]);

  const loadLevel = (levelIndex: number) => {
    const level = levels[levelIndex];
    setGrid(level.grid.map((row) => [...row]));
    setMoves(0);
    setIsCompleted(false);
  };

  const findPlayer = (): Position | null => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === "@" || grid[row][col] === "P") {
          return { row, col };
        }
      }
    }
    return null;
  };

  const checkWin = (newGrid: Cell[][]) => {
    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[row].length; col++) {
        if (newGrid[row][col] === "T") {
          return false;
        }
      }
    }
    return true;
  };

  const move = (direction: "up" | "down" | "left" | "right") => {
    if (isCompleted) return;

    const player = findPlayer();
    if (!player) return;

    const deltas = {
      up: { row: -1, col: 0 },
      down: { row: 1, col: 0 },
      left: { row: 0, col: -1 },
      right: { row: 0, col: 1 },
    };

    const delta = deltas[direction];
    const newRow = player.row + delta.row;
    const newCol = player.col + delta.col;

    if (
      newRow < 0 ||
      newRow >= grid.length ||
      newCol < 0 ||
      newCol >= grid[0].length
    ) {
      return;
    }

    const targetCell = grid[newRow][newCol];

    if (targetCell === "#") {
      return;
    }

    const newGrid = grid.map((row) => [...row]);

    if (targetCell === " " || targetCell === "T") {
      const currentCell = grid[player.row][player.col];
      newGrid[player.row][player.col] = currentCell === "P" ? "T" : " ";
      newGrid[newRow][newCol] = targetCell === "T" ? "P" : "@";
      setGrid(newGrid);
      setMoves(moves + 1);
    } else if (targetCell === "B" || targetCell === "X") {
      const boxNewRow = newRow + delta.row;
      const boxNewCol = newCol + delta.col;

      if (
        boxNewRow < 0 ||
        boxNewRow >= grid.length ||
        boxNewCol < 0 ||
        boxNewCol >= grid[0].length
      ) {
        return;
      }

      const boxTargetCell = grid[boxNewRow][boxNewCol];

      if (boxTargetCell === " " || boxTargetCell === "T") {
        const currentCell = grid[player.row][player.col];
        newGrid[player.row][player.col] = currentCell === "P" ? "T" : " ";
        newGrid[newRow][newCol] = targetCell === "X" ? "P" : "@";
        newGrid[boxNewRow][boxNewCol] = boxTargetCell === "T" ? "X" : "B";
        setGrid(newGrid);
        setMoves(moves + 1);

        if (checkWin(newGrid)) {
          setIsCompleted(true);
        }
      }
    }
  };

  const nextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    }
  };

  const resetLevel = () => {
    loadLevel(currentLevelIndex);
  };

  const getCellColor = (cell: Cell) => {
    switch (cell) {
      case "#":
        return systemGray as string;
      case "B":
        return systemYellow as string;
      case "T":
        return systemGreen as string;
      case "@":
        return systemBlue as string;
      case "P":
        return systemBlue as string;
      case "X":
        return systemRed as string;
      default:
        return secondarySystemBackground as string;
    }
  };

  const getCellSymbol = (cell: Cell) => {
    switch (cell) {
      case "#":
        return "🧱";
      case "B":
        return "📦";
      case "T":
        return "🎯";
      case "@":
        return "🧍";
      case "P":
        return "🧍";
      case "X":
        return "✅";
      default:
        return "";
    }
  };

  if (levels.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: label as string }}>No levels available</Text>
      </View>
    );
  }

  const cellSize = 40;

  return (
    <View style={{ flex: 1, backgroundColor: systemBackground as string }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <View style={{ gap: 8, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: label as string,
            }}
          >
            {levels[currentLevelIndex].name}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: secondaryLabel as string,
              fontVariant: "tabular-nums",
            }}
          >
            Moves: {moves}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: secondarySystemBackground as string,
            borderRadius: 12,
            borderCurve: "continuous",
            padding: 8,
          }}
        >
          {grid.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: "row" }}>
              {row.map((cell, colIndex) => (
                <View
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: getCellColor(cell),
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 1,
                    borderRadius: 4,
                    borderCurve: "continuous",
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{getCellSymbol(cell)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {isCompleted && (
          <View
            style={{
              backgroundColor: systemGreen as string,
              padding: 16,
              borderRadius: 12,
              borderCurve: "continuous",
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
              }}
            >
              Level Complete! 🎉
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "white",
                textAlign: "center",
                fontVariant: "tabular-nums",
              }}
            >
              Completed in {moves} moves
            </Text>
          </View>
        )}

        <Pressable
          onPress={resetLevel}
          style={({ pressed }) => ({
            backgroundColor: systemBlue as string,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            borderCurve: "continuous",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
            Reset Level
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 32,
          gap: 24,
        }}
      >
        {!isCompleted && (
          <View style={{ gap: 16, alignItems: "center" }}>
            <Pressable
              onPress={() => move("up")}
              style={({ pressed }) => ({
                backgroundColor: systemBlue as string,
                width: 80,
                height: 80,
                borderRadius: 40,
                justifyContent: "center",
                alignItems: "center",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 32, color: "white" }}>↑</Text>
            </Pressable>

            <View style={{ flexDirection: "row", gap: 16 }}>
              <Pressable
                onPress={() => move("left")}
                style={({ pressed }) => ({
                  backgroundColor: systemBlue as string,
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text style={{ fontSize: 32, color: "white" }}>←</Text>
              </Pressable>

              <Pressable
                onPress={() => move("down")}
                style={({ pressed }) => ({
                  backgroundColor: systemBlue as string,
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text style={{ fontSize: 32, color: "white" }}>↓</Text>
              </Pressable>

              <Pressable
                onPress={() => move("right")}
                style={({ pressed }) => ({
                  backgroundColor: systemBlue as string,
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text style={{ fontSize: 32, color: "white" }}>→</Text>
              </Pressable>
            </View>
          </View>
        )}

        {isCompleted && (
          <View style={{ gap: 16, alignItems: "center" }}>
            {currentLevelIndex < levels.length - 1 ? (
              <Pressable
                onPress={nextLevel}
                style={({ pressed }) => ({
                  backgroundColor: systemGreen as string,
                  paddingVertical: 20,
                  paddingHorizontal: 40,
                  borderRadius: 12,
                  borderCurve: "continuous",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Next Level →
                </Text>
              </Pressable>
            ) : (
              <View
                style={{
                  backgroundColor: systemYellow as string,
                  paddingVertical: 20,
                  paddingHorizontal: 40,
                  borderRadius: 12,
                  borderCurve: "continuous",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  All Levels Complete! 🏆
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
