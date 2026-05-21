import { render } from "@testing-library/react-native";
import { Confetti } from "@/components/confetti";

describe("Confetti", () => {
  it("renders nothing when inactive", () => {
    const { toJSON } = render(<Confetti active={false} />);
    expect(toJSON()).toBeNull();
  });

  it("renders particles when active", () => {
    const { toJSON } = render(<Confetti active={true} />);
    expect(toJSON()).not.toBeNull();
  });

  it("re-renders without crashing when toggled from inactive to active", () => {
    const { rerender } = render(<Confetti active={false} />);
    expect(() => rerender(<Confetti active={true} />)).not.toThrow();
  });

  it("re-renders without crashing when toggled from active to inactive", () => {
    const { rerender } = render(<Confetti active={true} />);
    expect(() => rerender(<Confetti active={false} />)).not.toThrow();
  });
});
