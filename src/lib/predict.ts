// Mock prediction logic. Replace with a real call to your Django backend later.
import { TEAMS, type Team } from "@/data/teams";

export type Prediction = {
  winner: Team;
  loser: Team;
  winnerProb: number;        // 0..1
  predictedScore: { winner: number; loser: number };
  factors: { label: string; winnerEdge: number }[]; // -1..1 (positive => winner)
};

// Deterministic pseudo-strength per team (stable across renders).
function strength(team: Team): number {
  let h = 0;
  for (const c of team.id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  // Map to ~60..95 (synthetic rating)
  return 60 + (h % 3500) / 100;
}

export async function predict(teamAId: string, teamBId: string): Promise<Prediction> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 900));

  const a = TEAMS.find((t) => t.id === teamAId)!;
  const b = TEAMS.find((t) => t.id === teamBId)!;
  const sa = strength(a);
  const sb = strength(b);

  // Logistic on rating diff
  const diff = sa - sb;
  const pA = 1 / (1 + Math.exp(-diff / 6));
  const winnerIsA = pA >= 0.5;
  const winner = winnerIsA ? a : b;
  const loser = winnerIsA ? b : a;
  const winnerProb = winnerIsA ? pA : 1 - pA;

  const base = 70 + Math.round((sa + sb) / 10);
  const margin = Math.max(2, Math.round(Math.abs(diff) * 0.9));
  const predictedScore = {
    winner: base + Math.round(margin / 2),
    loser: base - Math.round(margin / 2),
  };

  // Synthetic factor breakdown
  const seed = (winner.id + loser.id).split("").reduce((h, c) => (h * 17 + c.charCodeAt(0)) >>> 0, 7);
  const rand = (i: number) => (((seed >> (i * 3)) & 0xff) / 255) * 2 - 1;
  const factors = [
    { label: "Offensive Efficiency", winnerEdge: 0.3 + rand(1) * 0.4 },
    { label: "Defensive Rating", winnerEdge: 0.2 + rand(2) * 0.5 },
    { label: "Pace & Tempo", winnerEdge: rand(3) * 0.6 },
    { label: "Rebound Margin", winnerEdge: 0.15 + rand(4) * 0.5 },
    { label: "Strength of Schedule", winnerEdge: 0.1 + rand(5) * 0.6 },
  ].map((f) => ({ ...f, winnerEdge: Math.max(-1, Math.min(1, f.winnerEdge)) }));

  return { winner, loser, winnerProb, predictedScore, factors };
}
