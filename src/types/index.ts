export interface LeaderboardEntry {
  id?: string;
  username: string;
  completion_time: number; // milliseconds
  wpm: number;
  accuracy: number;
  created_at?: string;
}

export type GamePhase =
  | "landing"
  | "username"
  | "countdown"
  | "playing"
  | "complete"
  | "leaderboard";

export interface GameResult {
  username: string;
  completionTime: number;
  wpm: number;
  accuracy: number;
  rank?: number;
  beatPercent?: number;
}
