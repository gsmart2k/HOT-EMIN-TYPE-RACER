"use client";

import { create } from "zustand";
import type { GamePhase, GameResult } from "@/types";

interface GameState {
  phase: GamePhase;
  username: string;
  result: GameResult | null;

  setPhase: (phase: GamePhase) => void;
  setUsername: (username: string) => void;
  setResult: (result: GameResult) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: "landing",
  username: "",
  result: null,

  setPhase: (phase) => set({ phase }),
  setUsername: (username) => set({ username }),
  setResult: (result) => set({ result }),
  reset: () =>
    set({ phase: "landing", username: "", result: null }),
}));
