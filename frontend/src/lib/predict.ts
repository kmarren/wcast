import { BACKEND_TEAM_STATS, TEAMS, type Team } from "@/data/teams";

const PREDICTION_PATH = "/api/predict/";

export type ModelPick = {
  model: "Logistic Regression" | "Random Forest";
  result: "Win" | "Loss";
  winner: Team;
  lossProbability: number;
  winProbability: number;
};

export type Prediction = {
  modelPicks: ModelPick[];
  backendPayload: {
    team: string;
    opponent: string;
  };
};

export type PredictionInputStats = {
  teamGamesPlayed?: number;
  teamWinPercentage?: number;
  teamSOS?: number;
  opponentGamesPlayed?: number;
  opponentWinPercentage?: number;
  opponentSOS?: number;
};

function getStats(teamId: string) {
  const stats = BACKEND_TEAM_STATS[teamId];
  if (!stats) {
    throw new Error("No backend stats are configured for this team.");
  }

  return stats;
}

function winnerFor(result: "Win" | "Loss", teamA: Team, teamB: Team) {
  return result === "Win" ? teamA : teamB;
}

function statValue(value: number | undefined, fallback: number) {
  return String(Number.isFinite(value) ? value : fallback);
}

export async function predict(
  teamAId: string,
  teamBId: string,
  inputStats: PredictionInputStats = {},
): Promise<Prediction> {
  const teamA = TEAMS.find((t) => t.id === teamAId);
  const teamB = TEAMS.find((t) => t.id === teamBId);

  if (!teamA || !teamB) {
    throw new Error("Select two valid teams before running a prediction.");
  }

  const teamAStats = getStats(teamA.id);
  const teamBStats = getStats(teamB.id);

  const body = new URLSearchParams({
    team: teamAStats.backendName,
    teamGamesPlayed: statValue(inputStats.teamGamesPlayed, teamAStats.gamesPlayed),
    teamWinPercentage: statValue(inputStats.teamWinPercentage, teamAStats.winPercentage),
    teamSOS: statValue(inputStats.teamSOS, teamAStats.sos),
    opponent: teamBStats.backendName,
    opponentGamesPlayed: statValue(inputStats.opponentGamesPlayed, teamBStats.gamesPlayed),
    opponentWinPercentage: statValue(inputStats.opponentWinPercentage, teamBStats.winPercentage),
    opponentSOS: statValue(inputStats.opponentSOS, teamBStats.sos),
  });

  const response = await fetch(PREDICTION_PATH, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body,
  });

  if (!response.ok) {
    const html = await response.text();
    const message = html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180);
    throw new Error(
      `Django rejected the prediction request (${response.status} ${response.statusText}).${message ? ` ${message}` : ""}`,
    );
  }

  const data = await response.json();
  const logisticResult = data.logistic_prediction as "Win" | "Loss";
  const randomForestResult = data.random_forest_prediction as "Win" | "Loss";

  const logisticLossProbability = Number(data.logistic_probability[0]);
  const logisticWinProbability = Number(data.logistic_probability[1]);
  const randomForestLossProbability = Number(data.random_forest_probability[0]);
  const randomForestWinProbability = Number(data.random_forest_probability[1]);

  if (!logisticResult || !randomForestResult) {
    throw new Error("The backend response did not include prediction results.");
  }

  if (
  logisticLossProbability === undefined ||
  logisticWinProbability === undefined ||
  randomForestLossProbability === undefined ||
  randomForestWinProbability === undefined
) {
  throw new Error("The backend response did not include probability results.");
}

  const modelPicks: ModelPick[] = [
  {
    model: "Logistic Regression",
    result: logisticResult,
    winner: winnerFor(logisticResult, teamA, teamB),
    lossProbability: logisticLossProbability,
    winProbability: logisticWinProbability,
  },
  {
    model: "Random Forest",
    result: randomForestResult,
    winner: winnerFor(randomForestResult, teamA, teamB),
    lossProbability: randomForestLossProbability,
    winProbability: randomForestWinProbability,
  },
];

  return {
    modelPicks,
    backendPayload: {
      team: teamAStats.backendName,
      opponent: teamBStats.backendName,
    },
  };
}
