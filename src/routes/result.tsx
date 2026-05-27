import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { getTeam } from "@/data/teams";
import { TeamLogo } from "@/components/team-logo";
import { predict, type Prediction } from "@/lib/predict";

type Search = { a: string; b: string };

export const Route = createFileRoute("/result")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    a: String(s.a ?? ""),
    b: String(s.b ?? ""),
  }),
  head: () => ({
    meta: [
      { title: "Prediction Result — HoopsEdge" },
      { name: "description", content: "Machine learning matchup prediction for NCAA D1 Women's Basketball." },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { a, b } = Route.useSearch();
  const navigate = useNavigate();
  const teamA = getTeam(a);
  const teamB = getTeam(b);
  const [pred, setPred] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamA || !teamB) return;
    setLoading(true);
    setPred(null);
    predict(teamA.id, teamB.id).then((p) => {
      setPred(p);
      setLoading(false);
    });
  }, [teamA?.id, teamB?.id]);

  if (!teamA || !teamB) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-bold">Missing matchup</h1>
          <p className="mt-3 text-muted-foreground">Select two teams to generate a prediction.</p>
          <Link to="/predict" className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background">
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

      {loading || !pred ? (
        <LoadingState teamA={teamA} teamB={teamB} />
      ) : (
        <>
          {/* HERO RESULT */}
          <section className="border-b border-border bg-foreground text-background">
            <div className="mx-auto max-w-7xl px-6 py-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-background/60">
                Predicted Winner
              </p>
              <div className="mt-6 grid items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
                <ResultSide team={pred.winner} score={pred.predictedScore.winner} pct={pred.winnerProb} winner />
                <span className="text-center font-display text-2xl text-background/40">—</span>
                <ResultSide team={pred.loser} score={pred.predictedScore.loser} pct={1 - pred.winnerProb} align="right" />
              </div>

              <div className="mt-12">
                <div className="flex justify-between text-xs uppercase tracking-widest text-background/60">
                  <span>{pred.winner.short}</span>
                  <span>Win Probability</span>
                  <span>{pred.loser.short}</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-background/15">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-700"
                    style={{ width: `${Math.round(pred.winnerProb * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* FACTORS */}
          <section className="border-b border-border">
            <div className="mx-auto max-w-7xl px-6 py-16">
              <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">Model Breakdown</p>
                  <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
                    What's driving the call.
                  </h2>
                </div>
                <p className="max-w-md text-sm text-muted-foreground">
                  Edges shown favor <span className="font-semibold text-foreground">{pred.winner.short}</span>.
                  Negative values mean <span className="font-semibold text-foreground">{pred.loser.short}</span> has the advantage.
                </p>
              </div>

              <div className="space-y-4">
                {pred.factors.map((f) => {
                  const pct = Math.round(Math.abs(f.winnerEdge) * 100);
                  const positive = f.winnerEdge >= 0;
                  return (
                    <div key={f.label} className="rounded-2xl border border-border bg-card p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="font-display text-sm font-bold">{f.label}</p>
                        <p className="text-xs font-mono text-muted-foreground">
                          {positive ? "+" : "−"}{pct}% edge → {positive ? pred.winner.short : pred.loser.short}
                        </p>
                      </div>
                      <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
                        <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
                        <div
                          className={`absolute top-0 h-full ${positive ? "bg-primary" : "bg-foreground"}`}
                          style={{
                            left: positive ? "50%" : `${50 - pct / 2}%`,
                            width: `${pct / 2}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
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
                    predict(teamA.id, teamB.id).then((p) => {
                      setPred(p);
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

function ResultSide({
  team,
  score,
  pct,
  align = "left",
  winner = false,
}: {
  team: ReturnType<typeof getTeam>;
  score: number;
  pct: number;
  align?: "left" | "right";
  winner?: boolean;
}) {
  if (!team) return null;
  return (
    <div className={`flex flex-col items-center gap-4 ${align === "right" ? "md:items-end" : "md:items-start"}`}>
      <div className="rounded-2xl bg-background/5 p-4 ring-1 ring-background/10">
        <TeamLogo team={team} size={88} />
      </div>
      <div className={`${align === "right" ? "md:text-right" : "md:text-left"} text-center`}>
        {winner && (
          <span className="mb-2 inline-block rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
            Winner
          </span>
        )}
        <p className="font-display text-3xl font-bold leading-tight">{team.short}</p>
        <p className="text-xs uppercase tracking-wider text-background/60">{team.conference}</p>
      </div>
      <div className={`flex items-baseline gap-3 ${align === "right" ? "md:flex-row-reverse" : ""}`}>
        <p className="font-display text-6xl font-bold tracking-tight">{score}</p>
        <p className="font-mono text-sm text-background/60">{Math.round(pct * 100)}%</p>
      </div>
    </div>
  );
}

function LoadingState({ teamA, teamB }: { teamA: NonNullable<ReturnType<typeof getTeam>>; teamB: NonNullable<ReturnType<typeof getTeam>> }) {
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
