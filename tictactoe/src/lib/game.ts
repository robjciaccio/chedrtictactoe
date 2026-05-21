import { Mark, Square } from "@/types/game";

export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function getWinner(
  squares: Square[],
): { winner: Mark; line: number[] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a] as Mark, line };
    }
  }
  return null;
}

function minimax(
  squares: Square[],
  isMaximizing: boolean,
  cpu: Mark,
  human: Mark,
): number {
  const result = getWinner(squares);
  if (result?.winner === cpu) return 10;
  if (result?.winner === human) return -10;
  if (squares.every(Boolean)) return 0;
  let best = isMaximizing ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      squares[i] = isMaximizing ? cpu : human;
      const score = minimax(squares, !isMaximizing, cpu, human);
      squares[i] = null;
      best = isMaximizing ? Math.max(best, score) : Math.min(best, score);
    }
  }
  return best;
}

export function getBestMove(
  squares: Square[],
  cpu: Mark,
  human: Mark,
): number {
  let bestVal = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      squares[i] = cpu;
      const val = minimax(squares, false, cpu, human);
      squares[i] = null;
      if (val > bestVal) {
        bestVal = val;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

// Picks the move that is worst for the CPU (best for the human) so the user wins.
export function getWorstMove(
  squares: Square[],
  cpu: Mark,
  human: Mark,
): number {
  let worstVal = Infinity;
  let worstMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      squares[i] = cpu;
      const val = minimax(squares, false, cpu, human);
      squares[i] = null;
      if (val < worstVal) {
        worstVal = val;
        worstMove = i;
      }
    }
  }
  return worstMove;
}
