import { Link, useRouterState } from "@tanstack/react-router";

export function SiteHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = [
    { to: "/", label: "Home" },
    { to: "/predict", label: "Predict" },
    { to: "/about", label: "About" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/wcastlogo.png"
            alt="HoopsEdge logo"
            className="h-30 w-30 object-contain"
          />
        </Link>
        <nav className="hidden gap-1 md:flex">
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <Link
          to="/predict"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
        >
          Run Prediction
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-10 md:flex-row md:items-center">
        <div>
          <p className="font-display text-base font-bold">HoopsEdge</p>
          <p className="text-sm text-muted-foreground">
            ML-driven matchup predictions for NCAA D1 Women's Basketball.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} HoopsEdge — Predictions for entertainment only.
        </p>
      </div>
    </footer>
  );
}
