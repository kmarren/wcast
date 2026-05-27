import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "How HoopsEdge Works" },
      { name: "description", content: "How the HoopsEdge machine learning model predicts NCAA D1 Women's Basketball matchups." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</p>
          <h1 className="mt-2 font-display text-5xl font-bold tracking-tight">
            A model trained on a decade of D1 hoops.
          </h1>
          <div className="mt-10 space-y-8 text-lg leading-relaxed text-muted-foreground">
            <p>
              HoopsEdge is built on a Django backend that ingests advanced team
              metrics — offensive and defensive efficiency, pace, rebound margin,
              and strength of schedule — and runs them through machine learning
              models trained on years of NCAA Division I Women's Basketball game logs.
            </p>
            <p>
              For each matchup, the model produces a win probability, a projected
              final score, and a breakdown of which factors are pushing the call.
              The frontend you're using now is a clean window onto that engine.
            </p>
            <p className="text-sm">
              Predictions are for entertainment and analysis only — not gambling advice.
            </p>
          </div>
          <Link
            to="/predict"
            className="mt-12 inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
          >
            Try it now →
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
