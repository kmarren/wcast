import { BACKEND_TEAM_STATS, TEAMS, type Team } from "@/data/teams";

const PREDICTION_PATH = "/prediction/";

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

function extractCsrfToken(html: string) {
  return html.match(/name=["']csrfmiddlewaretoken["'] value=["']([^"']+)["']/)?.[1] ?? "";
}

function extractResult(html: string, heading: string) {
  const text = html.replace(/\s+/g, " ");
  return text.match(new RegExp(`${heading}.*?Prediction:\\s*(Win|Loss)`, "i"))?.[1] as
    | "Win"
    | "Loss"
    | undefined;
}

function extractProbability(html: string, label: string) {
  const text = html.replace(/\s+/g, " ");
  const value = text.match(new RegExp(`${label}:\\s*([0-9.]+)`, "i"))?.[1];
  return value ? Number(value) : undefined;
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

  const csrfResponse = await fetch(PREDICTION_PATH, {
    credentials: "include",
  });

  if (!csrfResponse.ok) {
    throw new Error("Could not reach the Django prediction page.");
  }

  const csrfToken = extractCsrfToken(await csrfResponse.text());
  if (!csrfToken) {
    throw new Error("Django did not provide a CSRF token.");
  }

  const body = new URLSearchParams({
    csrfmiddlewaretoken: csrfToken,
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
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRFToken": csrfToken,
      "X-Requested-With": "XMLHttpRequest",
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

  const html = await response.text();
  const logisticLossProbability = extractProbability(html, "Logistic Loss Probability");
  const logisticWinProbability = extractProbability(html, "Logistic Win Probability");
  const randomForestLossProbability = extractProbability(html, "Random Forest Loss Probability");
  const randomForestWinProbability = extractProbability(html, "Random Forest Win Probability");
  const logisticResult = extractResult(html, "Logistic Regression");
  const randomForestResult = extractResult(html, "Random Forest");

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
