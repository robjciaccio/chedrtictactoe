import { fireEvent, render, screen, act } from "@testing-library/react-native";
import { CoinFlip } from "@/components/coin-flip";

jest.mock("@/hooks/use-theme", () => ({
  useTheme: () => ({
    background: "#ffffff",
    backgroundElement: "#F0F0F3",
    backgroundSelected: "#E0E1E6",
    text: "#000000",
    textSecondary: "#60646C",
  }),
}));

describe("CoinFlip", () => {
  it("renders the idle state with a Flip Coin button", () => {
    render(<CoinFlip playerMark="X" onResult={() => {}} />);
    expect(screen.getByText("Flip Coin")).toBeTruthy();
  });

  it("shows both coin faces (X and O)", () => {
    render(<CoinFlip playerMark="X" onResult={() => {}} />);
    expect(screen.getByText("X")).toBeTruthy();
    expect(screen.getByText("O")).toBeTruthy();
  });

  it("hides the Flip Coin button after pressing it", async () => {
    render(<CoinFlip playerMark="X" onResult={() => {}} />);
    await act(async () => {
      fireEvent.press(screen.getByText("Flip Coin"));
    });
    expect(screen.queryByText("Flip Coin")).toBeNull();
  });

  it("shows a result message after the flip completes", async () => {
    render(<CoinFlip playerMark="X" onResult={() => {}} />);
    await act(async () => {
      fireEvent.press(screen.getByText("Flip Coin"));
    });
    const result =
      screen.queryByText("You go first!") ??
      screen.queryByText("X goes first!") ??
      screen.queryByText("O goes first!");
    expect(result).toBeTruthy();
  });

  it("shows a Let's Play button after the flip", async () => {
    render(<CoinFlip playerMark="X" onResult={() => {}} />);
    await act(async () => {
      fireEvent.press(screen.getByText("Flip Coin"));
    });
    expect(screen.getByText("Let's Play!")).toBeTruthy();
  });

  it("calls onResult with a boolean when Let's Play is pressed", async () => {
    const onResult = jest.fn();
    render(<CoinFlip playerMark="X" onResult={onResult} />);
    await act(async () => {
      fireEvent.press(screen.getByText("Flip Coin"));
    });
    fireEvent.press(screen.getByText("Let's Play!"));
    expect(onResult).toHaveBeenCalledTimes(1);
    expect(typeof onResult.mock.calls[0][0]).toBe("boolean");
  });

  it("does not show Flip Coin after it has been pressed", async () => {
    render(<CoinFlip playerMark="O" onResult={() => {}} />);
    await act(async () => {
      fireEvent.press(screen.getByText("Flip Coin"));
    });
    expect(screen.queryByText("Flip Coin")).toBeNull();
  });
});
