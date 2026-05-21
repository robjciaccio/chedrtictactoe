import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";

const { width: W, height: H } = Dimensions.get("window");

const COLORS = [
  "#3c87f7",
  "#ef4444",
  "#22c55e",
  "#F0B429",
  "#a855f7",
  "#ec4899",
  "#f97316",
  "#06b6d4",
];
const COUNT = 60;

type Particle = {
  progress: Animated.Value;
  translateX: Animated.AnimatedInterpolation<string | number>;
  translateY: Animated.AnimatedInterpolation<string | number>;
  rotate: Animated.AnimatedInterpolation<string | number>;
  opacity: Animated.AnimatedInterpolation<string | number>;
  color: string;
  width: number;
  height: number;
  borderRadius: number;
};

function createParticle(): Particle {
  const progress = new Animated.Value(0);
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 500 + 150;
  const vx = Math.cos(angle) * speed;
  // bias upward so the burst arcs before falling
  const vy = Math.sin(angle) * speed - 250;
  const rotation = (Math.random() - 0.5) * 1440;
  const size = Math.random() * 10 + 5;
  const isRect = Math.random() > 0.4;

  return {
    progress,
    translateX: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, vx],
    }),
    translateY: progress.interpolate({
      inputRange: [0, 0.35, 1],
      outputRange: [0, vy * 0.35, vy + 700],
    }),
    rotate: progress.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", `${rotation}deg`],
    }),
    opacity: progress.interpolate({
      inputRange: [0, 0.65, 1],
      outputRange: [1, 1, 0],
    }),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    width: isRect ? size * 0.6 : size,
    height: isRect ? size * 1.6 : size,
    borderRadius: isRect ? 2 : size / 2,
  };
}

type Props = { active: boolean };

export function Confetti({ active }: Props) {
  const particles = useRef<Particle[]>(
    Array.from({ length: COUNT }, createParticle),
  ).current;

  useEffect(() => {
    if (!active) return;
    particles.forEach((p) => p.progress.setValue(0));
    Animated.parallel(
      particles.map((p) =>
        Animated.timing(p.progress, {
          toValue: 1,
          duration: Math.random() * 1000 + 1800,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
      ),
    ).start();
  }, [active]);

  if (!active) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            left: W / 2,
            top: H * 0.38,
            width: p.width,
            height: p.height,
            borderRadius: p.borderRadius,
            backgroundColor: p.color,
            opacity: p.opacity,
            transform: [
              { translateX: p.translateX },
              { translateY: p.translateY },
              { rotate: p.rotate },
            ],
          }}
        />
      ))}
    </View>
  );
}
