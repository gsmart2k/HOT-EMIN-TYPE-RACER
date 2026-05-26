import { supabase } from "./supabase";
import type { LeaderboardEntry } from "@/types";

export async function submitScore(entry: Omit<LeaderboardEntry, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("leaderboard")
    .insert([entry])
    .select()
    .single();

  if (error) throw error;
  return data as LeaderboardEntry;
}

export async function fetchLeaderboard(limit = 100): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("completion_time", { ascending: true })
    .order("wpm", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as LeaderboardEntry[];
}

export async function fetchRank(completionTime: number): Promise<number> {
  const { count, error } = await supabase
    .from("leaderboard")
    .select("*", { count: "exact", head: true })
    .lt("completion_time", completionTime);

  if (error) return 1;
  return (count ?? 0) + 1;
}

export async function fetchTotalPlayers(): Promise<number> {
  const { count, error } = await supabase
    .from("leaderboard")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}
