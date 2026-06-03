import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { getTeam } from "@/data/teams";
import { TeamLogo } from "@/components/team-logo";
import { predict, type Prediction, type PredictionInputStats } from "@/lib/predict";

type Search = {
  a: string;
  b: string;
  agp: string;
  awp: string;
  asos: string;
  bgp: string;
  bwp: string;
  bsos: string;
};

export const Route = createFileRoute("/result")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    a: String(s.a ?? ""),
    b: String(s.b ?? ""),
    agp: String(s.agp ?? ""),
    awp: String(s.awp ?? ""),
    asos: String(s.asos ?? ""),
    bgp: String(s.bgp ?? ""),
    bwp: String(s.bwp ?? ""),
    bsos: String(s.bsos ?? ""),
  }),
  head: () => ({
    meta: [
      { title: "Prediction Result — HoopsEdge" },
      {
        name: "description",
        content: "Machine learning matchup prediction for NCAA D1 Women's Basketball.",
      },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { a, b, agp, awp, asos, bgp, bwp, bsos } = Route.useSearch();
  const navigate = useNavigate();
  const teamA = getTeam(a);
  const teamB = getTeam(b);
  const inputStats = useMemo<PredictionInputStats>(
    () => ({
      teamGamesPlayed: numericSearchValue(agp),
      teamWinPercentage: numericSearchValue(awp),
      teamSOS: numericSearchValue(asos),
      opponentGamesPlayed: numericSearchValue(bgp),
      opponentWinPercentage: numericSearchValue(bwp),
      opponentSOS: numericSearchValue(bsos),
    }),
    [agp, awp, asos, bgp, bwp, bsos],
  );
  const [pred, setPred] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamA || !teamB) return;
    setLoading(true);
    setPred(null);
    setError(null);
    predict(teamA.id, teamB.id, inputStats)
      .then((p) => {
        setPred(p);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [teamA?.id, teamB?.id, inputStats]);

  if (!teamA || !teamB) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-bold">Missing matchup</h1>
          <p className="mt-3 text-muted-foreground">Select two teams to generate a prediction.</p>
          <Link
            to="/predict"
            className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
          >
            Pick teams
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {loading ? (
        <LoadingState teamA={teamA} teamB={teamB} />
      ) : error || !pred ? (
        <ErrorState error={error ?? "Prediction failed."} />
      ) : (
        <>
          {/* MODEL PICKS */}
          <section className="border-b border-border bg-foreground text-background">
            <div className="mx-auto max-w-7xl px-6 py-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-background/60">
                Backend Prediction Results
              </p>
              <div className="mt-6 grid items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
                <MatchupSide team={teamA} label="Team A" />
                <span className="text-center font-display text-2xl text-background/40">—</span>
                <MatchupSide team={teamB} label="Team B" align="right" />
              </div>
            </div>
          </section>

          <section className="border-b border-border">
            <div className="mx-auto max-w-7xl px-6 py-16">
              <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Model Breakdown
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
                    Backend model picks.
                  </h2>
                </div>
                <p className="max-w-md text-sm text-muted-foreground">
                  Sent to Django as{" "}
                  <span className="font-semibold text-foreground">{pred.backendPayload.team}</span>{" "}
                  vs{" "}
                  <span className="font-semibold text-foreground">
                    {pred.backendPayload.opponent}
                  </span>
                  .
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {pred.modelPicks.map((pick) => (
                  <div key={pick.model} className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {pick.model}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <TeamLogo team={pick.winner} size={48} />
                      <div>
                        <p className="font-display text-xl font-bold">{pick.winner.short}</p>
                        <p className="text-sm text-muted-foreground">
                          Backend returned {pick.result} for Team A.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ACTIONS */}
          <section>
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-12 md:flex-row">
              <p className="text-sm text-muted-foreground">
                Want a different matchup? Run another prediction.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate({ to: "/predict" })}
                  className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-secondary"
                >
                  ← New matchup
                </button>
                <button
                  onClick={() => {
                    setLoading(true);
                    setError(null);
                    predict(teamA.id, teamB.id, inputStats)
                      .then((p) => {
                        setPred(p);
                      })
                      .catch((err: Error) => {
                        setError(err.message);
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Re-run model
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      <SiteFooter />
    </div>
  );
}

function numericSearchValue(value: string) {
  const parsed = Number(value);
  return value.trim() && Number.isFinite(parsed) ? parsed : undefined;
}

function MatchupSide({
  team,
  label,
  align = "left",
}: {
  team: ReturnType<typeof getTeam>;
  label: string;
  align?: "left" | "right";
}) {
  if (!team) return null;
  return (
    <div
      className={`flex flex-col items-center gap-4 ${align === "right" ? "md:items-end" : "md:items-start"}`}
    >
      <div className="rounded-2xl bg-background/5 p-4 ring-1 ring-background/10">
        <TeamLogo team={team} size={88} />
      </div>
      <div className={`${align === "right" ? "md:text-right" : "md:text-left"} text-center`}>
        <span className="mb-2 inline-block rounded-full bg-background/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-background/70">
          {label}
        </span>
        <p className="font-display text-3xl font-bold leading-tight">{team.short}</p>
        <p className="text-xs uppercase tracking-wider text-background/60">{team.conference}</p>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Backend connection failed</h1>
        <p className="mt-3 text-muted-foreground">{error}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Start Django on port 8000, then run the prediction again.
        </p>
        <Link
          to="/predict"
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
        >
          Back to matchup
        </Link>
      </div>
    </section>
  );
}

function LoadingState({
  teamA,
  teamB,
}: {
  teamA: NonNullable<ReturnType<typeof getTeam>>;
  teamB: NonNullable<ReturnType<typeof getTeam>>;
}) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex flex-col items-center gap-4 opacity-60">
            <TeamLogo team={teamA} size={88} />
            <p className="font-display text-2xl font-bold">{teamA.short}</p>
          </div>
          <div className="text-center">
            <div className="relative mx-auto h-16 w-16">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <div className="absolute inset-3 rounded-full bg-primary" />
            </div>
            <p className="mt-4 font-display text-sm uppercase tracking-widest text-muted-foreground">
              Running model…
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 opacity-60">
            <TeamLogo team={teamB} size={88} />
            <p className="font-display text-2xl font-bold">{teamB.short}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
