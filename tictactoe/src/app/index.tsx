import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CoinFlip } from "@/components/coin-flip";
import { Confetti } from "@/components/confetti";
import { SquareButton } from "@/components/square-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { getBestMove, getWinner, getWorstMove } from "@/lib/game";
import { Mark, Phase, Square } from "@/types/game";

export default function HomeScreen() {
  const [phase, setPhase] = useState<Phase>("select");
  const [playerMark, setPlayerMark] = useState<Mark>("X");
  const [squares, setSquares] = useState<Square[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [easyMode, setEasyMode] = useState(false);
  const [hasPlayedGame, setHasPlayedGame] = useState(false);

  const computerMark: Mark = playerMark === "X" ? "O" : "X";
  const result = getWinner(squares);
  const isBoardFull = squares.every(Boolean);
  const gameOver = !!result || isBoardFull;

  useEffect(() => {
    if (phase !== "game" || !gameOver) return;
    setHasPlayedGame(true);
    setEasyMode(false);
  }, [phase, gameOver]);

  useEffect(() => {
    if (phase !== "game" || isPlayerTurn || gameOver) return;
    const timer = setTimeout(() => {
      const move = easyMode
        ? getWorstMove(squares.slice(), computerMark, playerMark)
        : getBestMove(squares.slice(), computerMark, playerMark);
      if (move === -1) return;
      const next = squares.slice();
      next[move] = computerMark;
      setSquares(next);
      setIsPlayerTurn(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [phase, isPlayerTurn, squares, computerMark, playerMark, gameOver, easyMode]);

  function handleChoose(mark: Mark) {
    setPlayerMark(mark);
    setPhase("flip");
  }

  function handleFlipResult(playerGoesFirst: boolean) {
    setIsPlayerTurn(playerGoesFirst);
    setPhase("game");
  }

  function handlePress(index: number) {
    if (!isPlayerTurn || squares[index] || gameOver) return;
    const next = squares.slice();
    next[index] = playerMark;
    setSquares(next);
    setIsPlayerTurn(false);
  }

  function reset() {
    setSquares(Array(9).fill(null));
    setIsPlayerTurn(true);
    setEasyMode(false);
    setPhase("select");
  }

  function startEasyGame() {
    setSquares(Array(9).fill(null));
    setIsPlayerTurn(true);
    setEasyMode(true);
    setPhase("game");
  }

  if (phase === "select") {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="title" style={styles.title}>
            Tic Tac Toe
          </ThemedText>
          <ThemedText type="subtitle" style={styles.centeredText}>
            Choose your mark
          </ThemedText>
          <ThemedView style={styles.choiceRow}>
            <Pressable
              onPress={() => handleChoose("X")}
              style={({ pressed }) => [
                styles.choiceButton,
                { borderColor: "#3c87f7", opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <ThemedText style={[styles.choiceText, { color: "#3c87f7" }]}>
                X
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => handleChoose("O")}
              style={({ pressed }) => [
                styles.choiceButton,
                { borderColor: "#ef4444", opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <ThemedText style={[styles.choiceText, { color: "#ef4444" }]}>
                O
              </ThemedText>
            </Pressable>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (phase === "flip") {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <CoinFlip playerMark={playerMark} onResult={handleFlipResult} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  let status: string;
  if (result) {
    status =
      result.winner === playerMark ? "You win!" : `${computerMark} wins!`;
  } else if (isBoardFull) {
    status = "It's a draw!";
  } else {
    status = isPlayerTurn ? "Your turn" : `${computerMark} is thinking…`;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Tic Tac Toe
        </ThemedText>

        <ThemedText
          type="small"
          themeColor="textSecondary"
          style={styles.centeredText}
        >
          You are{" "}
          <ThemedText
            type="smallBold"
            style={{ color: playerMark === "X" ? "#3c87f7" : "#ef4444" }}
          >
            {playerMark}
          </ThemedText>
        </ThemedText>

        <ThemedText type="subtitle" style={styles.status}>
          {status}
        </ThemedText>

        <ThemedView style={styles.board}>
          {squares.map((sq, i) => (
            <SquareButton
              key={i}
              value={sq}
              onPress={() => handlePress(i)}
              highlighted={!!result?.line.includes(i)}
            />
          ))}
        </ThemedView>

        <Pressable onPress={reset} style={styles.primaryButton}>
          <ThemedText type="default" style={styles.primaryButtonText}>
            New Game
          </ThemedText>
        </Pressable>

        {hasPlayedGame && gameOver && (
          <Pressable onPress={startEasyGame} style={styles.easyButton}>
            <ThemedText type="default" style={styles.primaryButtonText}>
              Easy Game
            </ThemedText>
          </Pressable>
        )}
      </SafeAreaView>
      <Confetti active={result?.winner === playerMark} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  centeredText: {
    textAlign: "center",
  },
  status: {
    textAlign: "center",
    fontSize: 22,
    lineHeight: 30,
  },
  choiceRow: {
    flexDirection: "row",
    gap: Spacing.four,
  },
  choiceButton: {
    width: 110,
    height: 110,
    borderRadius: Spacing.three,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  choiceText: {
    fontSize: 56,
    fontWeight: "700",
    lineHeight: 64,
  },
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 312,
    gap: Spacing.two,
  },
  primaryButton: {
    backgroundColor: "#3c87f7",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + Spacing.half,
    borderRadius: Spacing.two,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  easyButton: {
    backgroundColor: "#22c55e",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + Spacing.half,
    borderRadius: Spacing.two,
  },
});
