import { Animated } from "react-native";

const noop = {
  start: (cb?: (r: { finished: boolean }) => void) => cb?.({ finished: true }),
  stop: jest.fn(),
  reset: jest.fn(),
};

// Intercept every Animated call so useNativeDriver never touches a real native view.
beforeEach(() => {
  jest.spyOn(Animated, "timing").mockImplementation(() => noop as ReturnType<typeof Animated.timing>);
  jest.spyOn(Animated, "spring").mockImplementation(() => noop as ReturnType<typeof Animated.spring>);
  jest.spyOn(Animated, "parallel").mockImplementation(() => noop as ReturnType<typeof Animated.parallel>);
  jest.spyOn(Animated, "sequence").mockImplementation(() => noop as ReturnType<typeof Animated.sequence>);
  jest.spyOn(Animated, "stagger").mockImplementation(() => noop as ReturnType<typeof Animated.stagger>);
});

afterEach(() => {
  jest.restoreAllMocks();
});
