import {
  WINNING_LINES,
  getBestMove,
  getWinner,
  getWorstMove,
} from "@/lib/game";
import { Square } from "@/types/game";

const _ = null;

// ─── getWinner ────────────────────────────────────────────────────────────────

describe("getWinner", () => {
  it("returns null for an empty board", () => {
    expect(getWinner(Array(9).fill(_))).toBeNull();
  });

  it("returns null for a board with no winner", () => {
    const board: Square[] = ["X", "O", "X", "O", "X", "O", "O", "X", "O"];
    expect(getWinner(board)).toBeNull();
  });

  it.each(WINNING_LINES)("detects X winning on line %#", (...line) => {
    const board: Square[] = Array(9).fill(_);
    line.forEach((i) => (board[i] = "X"));
    const result = getWinner(board);
    expect(result?.winner).toBe("X");
    expect(result?.line).toEqual(line);
  });

  it.each(WINNING_LINES)("detects O winning on line %#", (...line) => {
    const board: Square[] = Array(9).fill(_);
    line.forEach((i) => (board[i] = "O"));
    const result = getWinner(board);
    expect(result?.winner).toBe("O");
    expect(result?.line).toEqual(line);
  });

  it("returns the first winning line when multiple exist", () => {
    // X has top row AND left column — first matching line wins
    const board: Square[] = ["X", "X", "X", "X", "O", "O", "X", "O", "O"];
    const result = getWinner(board);
    expect(result?.winner).toBe("X");
    expect(result?.line).toEqual([0, 1, 2]);
  });

  it("does not return a winner for two in a row", () => {
    const board: Square[] = Array(9).fill(_);
    board[0] = "X";
    board[1] = "X";
    expect(getWinner(board)).toBeNull();
  });
});

// ─── getBestMove ──────────────────────────────────────────────────────────────

describe("getBestMove", () => {
  it("blocks an immediate human win", () => {
    // O about to win top row — CPU must play [2]
    const board: Square[] = ["O", "O", _, _, "X", _, _, _, "X"];
    expect(getBestMove(board, "X", "O")).toBe(2);
  });

  it("takes an immediate winning move", () => {
    // X can win top row at [2]
    const board: Square[] = ["X", "X", _, "O", "O", _, _, _, _];
    expect(getBestMove(board, "X", "O")).toBe(2);
  });

  it("prefers winning over blocking", () => {
    // X can win at [2] OR block O at [5] — should win
    const board: Square[] = ["X", "X", _, "O", "O", _, _, _, _];
    expect(getBestMove(board, "X", "O")).toBe(2);
  });

  it("returns a valid index on an empty board", () => {
    const move = getBestMove(Array(9).fill(_), "X", "O");
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
  });

  it("returns -1 when the board is full", () => {
    const board: Square[] = ["X", "O", "X", "O", "X", "O", "O", "X", "O"];
    expect(getBestMove(board, "X", "O")).toBe(-1);
  });

  it("returns a valid index (0-8) for a partial board", () => {
    const board: Square[] = [_, "X", "O", _, "X", _, "O", _, _];
    const move = getBestMove(board, "O", "X");
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
    expect(board[move]).toBeNull();
  });
});

// ─── getWorstMove ─────────────────────────────────────────────────────────────

describe("getWorstMove", () => {
  it("does not take an immediate winning move when a losing one exists", () => {
    // X can win at [2] (top row). O can win at [8] (bottom row) if X plays elsewhere.
    // getWorstMove should avoid winning and instead let O win.
    const board: Square[] = ["X", "X", _, _, _, _, "O", "O", _];
    const move = getWorstMove(board, "X", "O");
    // Best move is 2 (X wins); worst move should not be 2
    expect(move).not.toBe(2);
  });

  it("returns a valid index on a partial board", () => {
    const board: Square[] = [_, "X", "O", _, "X", _, "O", _, _];
    const move = getWorstMove(board, "O", "X");
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
    expect(board[move]).toBeNull();
  });

  it("returns -1 when the board is full", () => {
    const board: Square[] = ["X", "O", "X", "O", "X", "O", "O", "X", "O"];
    expect(getWorstMove(board, "X", "O")).toBe(-1);
  });

  it("returns a different move than getBestMove on a board with clear win/loss paths", () => {
    // X can win at [2]; O can win at [8] if X plays anywhere else.
    // Best move = 2 (X wins); worst move ≠ 2 (lets O win).
    const board: Square[] = ["X", "X", _, _, _, _, "O", "O", _];
    const best = getBestMove(board, "X", "O");
    const worst = getWorstMove(board, "X", "O");
    expect(best).toBe(2);
    expect(worst).not.toBe(best);
  });

  it("picks a move that lets the human win when possible", () => {
    // X can win at [2]; O will win at [8] if X doesn't play there.
    const board: Square[] = ["X", "X", _, _, _, _, "O", "O", _];
    const move = getWorstMove(board, "X", "O");
    expect(move).not.toBe(2);
  });
});
