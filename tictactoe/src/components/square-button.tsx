import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Square } from "@/types/game";

type Props = {
  value: Square;
  onPress: () => void;
  highlighted: boolean;
};

export function SquareButton({ value, onPress, highlighted }: Props) {
  const theme = useTheme();
  const popAnim = useRef(new Animated.Value(0)).current;
  const prevValue = useRef<Square>(null);

  useEffect(() => {
    if (value && !prevValue.current) {
      popAnim.setValue(0);
      Animated.spring(popAnim, {
        toValue: 1,
        tension: 180,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
    prevValue.current = value;
  }, [value]);

  const scale = popAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });

  const isFilled = !!value;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) =>
        isFilled
          ? [
              styles.square,
              styles.squareFilled,
              {
                backgroundColor: highlighted
                  ? theme.backgroundSelected
                  : theme.backgroundElement,
              },
            ]
          : [
              styles.square,
              {
                backgroundColor: pressed
                  ? theme.backgroundSelected
                  : theme.backgroundElement,
                borderColor: theme.backgroundSelected,
              },
            ]
      }
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <ThemedText
          style={[
            styles.squareText,
            {
              color:
                value === "X"
                  ? "#3c87f7"
                  : value === "O"
                    ? "#ef4444"
                    : "transparent",
            },
          ]}
        >
          {value ?? "."}
        </ThemedText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  square: {
    width: 96,
    height: 96,
    borderRadius: Spacing.two,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  squareFilled: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopColor: "rgba(255,255,255,0.28)",
    borderLeftColor: "rgba(255,255,255,0.18)",
    borderBottomColor: "rgba(0,0,0,0.32)",
    borderRightColor: "rgba(0,0,0,0.22)",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.38,
    shadowRadius: 4,
    elevation: 8,
  },
  squareText: {
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 56,
  },
});
