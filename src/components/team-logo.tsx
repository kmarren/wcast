import { useState } from "react";
import { logoUrl, type Team } from "@/data/teams";

export function TeamLogo({ team, size = 56 }: { team: Team; size?: number }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div
        className="flex items-center justify-center rounded-full font-display font-bold text-background"
        style={{ width: size, height: size, backgroundColor: team.primary }}
      >
        {team.short
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")}
      </div>
    );
  }
  return (
    <img
      src={logoUrl(team.espnId)}
      alt={`${team.name} logo`}
      width={size}
      height={size}
      onError={() => setErr(true)}
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
}
