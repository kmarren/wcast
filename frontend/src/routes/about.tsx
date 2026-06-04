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
            For womens basketball fans by womens basketball fans. 
          </h1>
          <div className="mt-10 space-y-8 text-lg leading-relaxed text-muted-foreground">
            <p>
              Women's basketball is rapidly gaining popularity around the world, but has historically been under-represented in similar machine learning contexts. This provided an interesting landscape for exploring this domain. This project explores binary game outcome predictions for NCAA Division 1 Women's Basketball games during the 2025-2026 season using random forest and logistic regression.
            </p>
            <p>
              For each matchup, each model predicts both the game outcome and probability. Be sure to pay attention to both, 
              the real insight often lies more in the probability than the prediction. 
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
