import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { TEAMS } from "@/data/teams";
import { TeamLogo } from "@/components/team-logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HoopsEdge — NCAA Women's Basketball Predictions" },
      {
        name: "description",
        content:
          "Explore the landscape of NCAA Division I Women's Basketball and predict matchup winners with machine learning.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  // pick a few marquee logos
  const marquee = [
    "south-carolina", "iowa", "lsu", "uconn-placeholder", "ucla", "notre-dame",
    "stanford", "texas", "tennessee", "duke", "nc-state", "usc",
  ]
    .map((id) => TEAMS.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 10) as typeof TEAMS;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.2fr_1fr] md:py-28">
          <div className="flex flex-col justify-center">
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              2025–26 Season · Power 4 Coverage
            </span>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Who wins on
              <br />
              <span className="text-primary">tip-off night?</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              HoopsEdge uses a machine learning model trained on years of NCAA
              Division I Women's Basketball box scores, advanced metrics, and
              matchup history to project the winner of any head-to-head.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/predict"
                className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
              >
                Pick two teams →
              </Link>
              <Link
                to="/about"
                className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                How it works
              </Link>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                { k: "68", l: "Power 4 teams" },
                { k: "10k+", l: "Games modeled" },
                { k: "73%", l: "Backtest accuracy" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-3xl font-bold tracking-tight">{s.k}</dt>
                  <dd className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Featured matchup card */}
          <div className="relative">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
              <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Sample matchup
              </p>
              <div className="flex items-center justify-between gap-4">
                <FeaturedSide id="south-carolina" pct={62} />
                <span className="font-display text-2xl text-muted-foreground">vs</span>
                <FeaturedSide id="iowa" pct={38} align="right" />
              </div>
              <div className="mt-8 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-foreground" style={{ width: "62%" }} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Projected: <span className="font-semibold text-foreground">South Carolina 78 – 71 Iowa</span>
              </p>
              <Link
                to="/predict"
                className="mt-6 flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                Build your own matchup
              </Link>
            </div>
            <div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-3xl"
              aria-hidden
            />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-b border-border bg-[var(--beige)]/50">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Featured programs
          </p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
            {marquee.map((t) => (
              <div key={t.id} className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                <TeamLogo team={t} size={36} />
                <span className="text-sm font-medium">{t.short}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LANDSCAPE */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              The Landscape
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Women's college basketball has never been more competitive.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Record TV audiences, NIL reshaping rosters, and conference
              realignment putting bluebloods in new leagues — every matchup
              now carries playoff weight from November to April.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                tag: "SEC",
                title: "The new juggernaut.",
                body: "South Carolina's dynasty plus Texas, Oklahoma, LSU, Tennessee, and Kentucky make the SEC the deepest conference in the country.",
              },
              {
                tag: "Big Ten",
                title: "Coast to coast.",
                body: "USC, UCLA, Oregon, and Washington join Iowa, Ohio State, and Maryland in a 18-team super-league spanning four time zones.",
              },
              {
                tag: "ACC",
                title: "Tradition meets pace.",
                body: "Notre Dame, NC State, Duke, UNC, and Louisville anchor the ACC — with Stanford and Cal bringing West Coast pedigree.",
              },
              {
                tag: "Big 12",
                title: "Wide-open race.",
                body: "Baylor and Kansas State headline, but Arizona, Utah, and BYU make any given Saturday a coin flip.",
              },
              {
                tag: "Stars",
                title: "The post-Caitlin era.",
                body: "JuJu Watkins, Hannah Hidalgo, MiLaysia Fulwiley, and Madison Booker are the new faces driving record viewership.",
              },
              {
                tag: "Tournament",
                title: "March is bigger.",
                body: "Expanded media rights, neutral-site early rounds, and a Final Four watched by millions — the stakes have never been higher.",
              },
            ].map((c) => (
              <article
                key={c.title}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-[var(--shadow-card)]"
              >
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                  {c.tag}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold leading-tight">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {c.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-20 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Ready to call the game?
            </h2>
            <p className="mt-4 text-lg text-background/70">
              Pick any two Power 4 teams and our model will project the winner,
              the final score, and the factors that swing it.
            </p>
          </div>
          <Link
            to="/predict"
            className="rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.03]"
          >
            Start a prediction →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FeaturedSide({ id, pct, align = "left" }: { id: string; pct: number; align?: "left" | "right" }) {
  const team = TEAMS.find((t) => t.id === id);
  if (!team) return null;
  return (
    <div className={`flex flex-1 flex-col items-center gap-2 ${align === "right" ? "" : ""}`}>
      <TeamLogo team={team} size={64} />
      <p className="font-display text-sm font-bold">{team.short}</p>
      <p className="font-display text-2xl font-bold text-primary">{pct}%</p>
    </div>
  );
}
