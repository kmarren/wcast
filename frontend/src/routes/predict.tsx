import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { BACKEND_TEAM_STATS, TEAMS, type Team } from "@/data/teams";
import { TeamLogo } from "@/components/team-logo";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/predict")({
  head: () => ({
    meta: [
      { title: "Pick Your Matchup — HoopsEdge" },
      {
        name: "description",
        content:
          "Select two NCAA D1 Women's Basketball teams to generate a machine learning matchup prediction.",
      },
    ],
  }),
  component: PredictPage,
});

const CONFERENCES = ["All", "SEC", "Big Ten", "ACC", "Big 12"] as const;
type Conf = (typeof CONFERENCES)[number];
type StatValues = {
  gamesPlayed: string;
  winPercentage: string;
  sos: string;
};

const EMPTY_STATS: StatValues = {
  gamesPlayed: "",
  winPercentage: "",
  sos: "",
};

function statsForTeam(team: Team | null): StatValues {
  if (!team) return EMPTY_STATS;
  const stats = BACKEND_TEAM_STATS[team.id];

  return {
    gamesPlayed: String(stats?.gamesPlayed ?? ""),
    winPercentage: String(stats?.winPercentage ?? ""),
    sos: String(stats?.sos ?? ""),
  };
}

function validStats(stats: StatValues) {
  const gamesPlayed = Number(stats.gamesPlayed);
  const winPercentage = Number(stats.winPercentage);
  const sos = Number(stats.sos);

  return (
    Number.isInteger(gamesPlayed) &&
    gamesPlayed >= 0 &&
    Number.isFinite(winPercentage) &&
    winPercentage >= 0 &&
    winPercentage <= 1 &&
    Number.isFinite(sos)
  );
}

function PredictPage() {
  const navigate = useNavigate();
  const [teamA, setTeamA] = useState<Team | null>(null);
  const [teamB, setTeamB] = useState<Team | null>(null);
  const [active, setActive] = useState<"A" | "B">("A");
  const [conf, setConf] = useState<Conf>("All");
  const [query, setQuery] = useState("");
  const [teamAStats, setTeamAStats] = useState<StatValues>(EMPTY_STATS);
  const [teamBStats, setTeamBStats] = useState<StatValues>(EMPTY_STATS);

  useEffect(() => {
    setTeamAStats(statsForTeam(teamA));
  }, [teamA?.id]);

  useEffect(() => {
    setTeamBStats(statsForTeam(teamB));
  }, [teamB?.id]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEAMS.filter((t) => conf === "All" || t.conference === conf).filter(
      (t) => !q || t.name.toLowerCase().includes(q) || t.short.toLowerCase().includes(q),
    );
  }, [conf, query]);

  const canPredict =
    teamA && teamB && teamA.id !== teamB.id && validStats(teamAStats) && validStats(teamBStats);

  const select = (t: Team) => {
    if (active === "A") {
      if (teamB?.id === t.id) setTeamB(null);
      setTeamA(t);
      setActive("B");
    } else {
      if (teamA?.id === t.id) setTeamA(null);
      setTeamB(t);
      setActive("A");
    }
  };

  const run = () => {
    if (!canPredict) return;
    navigate({
      to: "/result",
      search: {
        a: teamA!.id,
        b: teamB!.id,
        agp: teamAStats.gamesPlayed,
        awp: teamAStats.winPercentage,
        asos: teamAStats.sos,
        bgp: teamBStats.gamesPlayed,
        bwp: teamBStats.winPercentage,
        bsos: teamBStats.sos,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Step 1 · Build the matchup
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Pick two teams.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Tap a slot below, then choose a school from the grid. The model takes it from there.
          </p>
        </div>
      </section>

      {/* SLOTS */}
      <section className="border-b border-border bg-[var(--beige)]/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-[1fr_auto_1fr]">
          <TeamSlot
            label="Team A"
            team={teamA}
            active={active === "A"}
            onClick={() => setActive("A")}
            onClear={() => setTeamA(null)}
          />
          <div className="flex items-center justify-center font-display text-3xl text-muted-foreground">
            vs
          </div>
          <TeamSlot
            label="Team B"
            team={teamB}
            active={active === "B"}
            onClick={() => setActive("B")}
            onClear={() => setTeamB(null)}
          />
        </div>
        {(teamA || teamB) && (
          <div className="mx-auto grid max-w-7xl gap-4 px-6 pb-8 md:grid-cols-2">
            <StatsPanel
              label="Team A inputs"
              team={teamA}
              stats={teamAStats}
              onChange={setTeamAStats}
            />
            <StatsPanel
              label="Team B inputs"
              team={teamB}
              stats={teamBStats}
              onChange={setTeamBStats}
            />
          </div>
        )}
        <div className="mx-auto max-w-7xl px-6 pb-10">
          <button
            onClick={run}
            disabled={!canPredict}
            className="w-full rounded-full bg-foreground px-6 py-4 font-display text-base font-semibold text-background shadow-sm transition-all hover:scale-[1.005] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            {canPredict ? "Predict winner →" : "Select two teams and valid model inputs"}
          </button>
        </div>
      </section>

      {/* FILTER */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {CONFERENCES.map((c) => (
                <button
                  key={c}
                  onClick={() => setConf(c)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    conf === c
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teams…"
              className="w-full rounded-full border border-border bg-card px-5 py-2.5 text-sm outline-none transition-colors focus:border-foreground md:w-72"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((t) => {
              const isA = teamA?.id === t.id;
              const isB = teamB?.id === t.id;
              const selected = isA || isB;
              return (
                <button
                  key={t.id}
                  onClick={() => select(t)}
                  className={`group relative flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 text-center transition-all ${
                    selected
                      ? "border-foreground shadow-[var(--shadow-card)]"
                      : "border-border hover:border-foreground/40 hover:-translate-y-0.5"
                  }`}
                >
                  {selected && (
                    <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                      {isA ? "A" : "B"}
                    </span>
                  )}
                  <TeamLogo team={t} size={56} />
                  <div>
                    <p className="font-display text-sm font-bold leading-tight">{t.short}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {t.conference}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No teams match that search.
            </p>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function StatsPanel({
  label,
  team,
  stats,
  onChange,
}: {
  label: string;
  team: Team | null;
  stats: StatValues;
  onChange: (stats: StatValues) => void;
}) {
  const disabled = !team;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 font-display text-lg font-bold">{team?.short ?? "Choose a team"}</p>
        </div>
        {team && <TeamLogo team={team} size={40} />}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <LabeledNumber
          label="Games played"
          value={stats.gamesPlayed}
          disabled={disabled}
          min={0}
          step={1}
          onChange={(gamesPlayed) => onChange({ ...stats, gamesPlayed })}
        />
        <LabeledNumber
          label="Win pct"
          value={stats.winPercentage}
          disabled={disabled}
          min={0}
          max={1}
          step={0.0001}
          onChange={(winPercentage) => onChange({ ...stats, winPercentage })}
        />
        <LabeledNumber
          label="SOS"
          value={stats.sos}
          disabled={disabled}
          step={0.0001}
          onChange={(sos) => onChange({ ...stats, sos })}
        />
      </div>
    </div>
  );
}

function LabeledNumber({
  label,
  value,
  disabled,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: string;
  disabled: boolean;
  min?: number;
  max?: number;
  step: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1.5 text-sm">
      <span className="block text-xs font-medium text-muted-foreground">{label}</span>
      <Input
        type="number"
        value={value}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 bg-background"
      />
    </label>
  );
}

function TeamSlot({
  label,
  team,
  active,
  onClick,
  onClear,
}: {
  label: string;
  team: Team | null;
  active: boolean;
  onClick: () => void;
  onClear: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed bg-card p-6 transition-all ${
        active ? "border-primary bg-primary/5" : "border-border"
      } ${team ? "border-solid border-foreground" : ""}`}
    >
      <span className="absolute left-4 top-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {team ? (
        <>
          <TeamLogo team={team} size={72} />
          <div>
            <p className="font-display text-lg font-bold">{team.short}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {team.conference}
            </p>
          </div>
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="absolute right-4 top-4 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground hover:text-foreground"
          >
            Clear
          </span>
        </>
      ) : (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-display font-bold text-muted-foreground">
            +
          </div>
          <p className="text-sm text-muted-foreground">
            {active ? "Pick from the list below" : "Tap to select"}
          </p>
        </>
      )}
    </button>
  );
}
