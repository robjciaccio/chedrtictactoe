import { Pressable, StyleSheet } from "react-native";

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
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.square,
        {
          backgroundColor: highlighted
            ? theme.backgroundSelected
            : pressed
              ? theme.backgroundSelected
              : theme.backgroundElement,
          borderColor: theme.backgroundSelected,
        },
      ]}
    >
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
  squareText: {
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 56,
  },
});
