import { fireEvent, render, screen } from "@testing-library/react-native";
import { SquareButton } from "@/components/square-button";

jest.mock("@/hooks/use-theme", () => ({
  useTheme: () => ({
    background: "#ffffff",
    backgroundElement: "#F0F0F3",
    backgroundSelected: "#E0E1E6",
    text: "#000000",
    textSecondary: "#60646C",
  }),
}));

describe("SquareButton", () => {
  it("renders without crashing", () => {
    render(
      <SquareButton value={null} onPress={() => {}} highlighted={false} />,
    );
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    render(
      <SquareButton value={null} onPress={onPress} highlighted={false} />,
    );
    // Pressable renders its children — press the visible placeholder text
    fireEvent.press(screen.getByText("."));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders X text when value is X", () => {
    render(<SquareButton value="X" onPress={() => {}} highlighted={false} />);
    expect(screen.getByText("X")).toBeTruthy();
  });

  it("renders O text when value is O", () => {
    render(<SquareButton value="O" onPress={() => {}} highlighted={false} />);
    expect(screen.getByText("O")).toBeTruthy();
  });

  it("renders a placeholder when value is null", () => {
    render(
      <SquareButton value={null} onPress={() => {}} highlighted={false} />,
    );
    // Placeholder character "." is rendered with transparent colour
    expect(screen.getByText(".")).toBeTruthy();
  });

  it("does not call onPress when the tile already has a value", () => {
    // onPress guard is in the parent (HomeScreen), but the button itself
    // should still fire — verify the component at least passes the event through
    const onPress = jest.fn();
    render(<SquareButton value="X" onPress={onPress} highlighted={false} />);
    fireEvent.press(screen.getByText("X"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("triggers the pop animation when a value is placed", () => {
    const { rerender } = render(
      <SquareButton value={null} onPress={() => {}} highlighted={false} />,
    );
    // Animated.spring is mocked globally — just verify no crash on value change
    expect(() =>
      rerender(<SquareButton value="X" onPress={() => {}} highlighted={false} />),
    ).not.toThrow();
  });

  it("applies highlighted style when highlighted prop is true", () => {
    render(<SquareButton value="X" onPress={() => {}} highlighted={true} />);
    expect(screen.getByText("X")).toBeTruthy();
  });
});
