import { useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { Mark } from "@/types/game";

type Props = {
  playerMark: Mark;
  onResult: (playerGoesFirst: boolean) => void;
};

export function CoinFlip({ playerMark, onResult }: Props) {
  const [flipState, setFlipState] = useState<"idle" | "spinning" | "result">(
    "idle",
  );
  const [landedMark, setLandedMark] = useState<Mark>("X");
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const yAnim = useRef(new Animated.Value(0)).current;
  const resultFade = useRef(new Animated.Value(0)).current;

  // Front face (X) rotates from 0° — visible at multiples of 360°
  // Back face (O) starts at 180° — visible at 180° + multiples of 360°
  // X lands face-up at 1080° (3 full spins), O lands face-up at 900° (2.5 spins)
  const rotateYFront = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
    extrapolate: "extend",
  });
  const rotateYBack = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["180deg", "540deg"],
    extrapolate: "extend",
  });

  function flip() {
    if (flipState !== "idle") return;
    const landed: Mark = Math.random() < 0.5 ? "X" : "O";
    const targetAngle = landed === "X" ? 1080 : 900;
    setFlipState("spinning");
    rotateAnim.setValue(0);
    yAnim.setValue(0);
    resultFade.setValue(0);

    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: targetAngle,
        duration: 1600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.sequence([
        Animated.timing(yAnim, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(yAnim, {
          toValue: 0,
          duration: 1100,
          useNativeDriver: true,
          easing: Easing.in(Easing.quad),
        }),
      ]),
    ]).start(() => {
      setLandedMark(landed);
      setFlipState("result");
      Animated.timing(resultFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  }

  const playerGoesFirst = landedMark === playerMark;

  return (
    <>
      {/* <ThemedText type="title" style={styles.title}>
        Coin Flip
      </ThemedText> */}
      <ThemedText
        type="subtitle"
        themeColor="textSecondary"
        style={styles.centeredText}
      >
        {flipState === "idle"
          ? "Who goes first?\nFlip for it!"
          : flipState === "spinning"
            ? "Flipping…"
            : ""}
      </ThemedText>

      <Animated.View style={{ transform: [{ translateY: yAnim }] }}>
        <View style={styles.coinContainer}>
          <Animated.View
            style={[
              styles.coin,
              StyleSheet.absoluteFill,
              {
                backfaceVisibility: "hidden",
                transform: [{ perspective: 800 }, { rotateY: rotateYFront }],
              },
            ]}
          >
            <View style={styles.coinRing}>
              <ThemedText style={[styles.coinLabel, { color: "#1A56B0" }]}>
                X
              </ThemedText>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.coin,
              StyleSheet.absoluteFill,
              {
                backfaceVisibility: "hidden",
                transform: [{ perspective: 800 }, { rotateY: rotateYBack }],
              },
            ]}
          >
            <View style={styles.coinRing}>
              <ThemedText style={[styles.coinLabel, { color: "#991B1B" }]}>
                O
              </ThemedText>
            </View>
          </Animated.View>
        </View>
      </Animated.View>

      {flipState === "idle" && (
        <Pressable onPress={flip} style={styles.primaryButton}>
          <ThemedText type="default" style={styles.primaryButtonText}>
            Flip Coin
          </ThemedText>
        </Pressable>
      )}

      {flipState === "result" && (
        <Animated.View
          style={[styles.resultContainer, { opacity: resultFade }]}
        >
          <ThemedText type="subtitle" style={styles.centeredText}>
            {playerGoesFirst ? "You go first!" : `${landedMark} goes first!`}
          </ThemedText>
          {/* <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.centeredText}
          >
            {landedMark} landed face up
          </ThemedText> */}
          <Pressable
            onPress={() => onResult(playerGoesFirst)}
            style={styles.primaryButton}
          >
            <ThemedText type="default" style={styles.primaryButtonText}>
              Let's Play!
            </ThemedText>
          </Pressable>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },
  centeredText: {
    textAlign: "center",
  },
  coinContainer: {
    width: 140,
    height: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  coin: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F0B429",
    alignItems: "center",
    justifyContent: "center",
  },
  coinRing: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  coinLabel: {
    fontSize: 52,
    fontWeight: "800",
    lineHeight: 60,
  },
  resultContainer: {
    alignItems: "center",
    gap: Spacing.three,
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
});
