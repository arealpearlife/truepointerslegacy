"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Flake = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  opacity: number;
};

function buildFlakes(count: number, seed: number): Flake[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: (index * 37 + seed * 11) % 100,
    delay: ((index * 53 + seed * 7) % 90) / 10,
    duration: 8 + ((index + seed) % 8),
    size: 2 + ((index + seed) % 5),
    drift: (index % 2 === 0 ? -1 : 1) * (18 + ((index + seed) % 36)),
    opacity: 0.28 + (index % 5) * 0.1,
  }));
}

const HOUSE_FLAKES = buildFlakes(34, 3);
const GUST_FLAKES = buildFlakes(20, 9);

function FlakeField({ flakes, className }: { flakes: readonly Flake[]; className: string }) {
  return (
    <div className={className} aria-hidden="true">
      {flakes.map((flake) => (
        <i
          key={flake.id}
          style={{
            left: `${flake.left}%`,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
            ["--ice-drift" as string]: `${flake.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

export function IceGust() {
  return (
    <div className="ice-gust" aria-hidden="true">
      <FlakeField flakes={GUST_FLAKES} className="ice-gust-field" />
    </div>
  );
}

export function IceAtmosphere() {
  const path = usePathname() ?? "/";
  const first = useRef(true);
  const [splash, setSplash] = useState(false);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    setSplash(true);
    const wait = window.setTimeout(() => setSplash(false), 720);
    return () => window.clearTimeout(wait);
  }, [path]);

  return (
    <>
      <div className="ice-flurry" aria-hidden="true">
        <FlakeField flakes={HOUSE_FLAKES} className="ice-flurry-field" />
      </div>
      <div className={splash ? "frost-splash is-on" : "frost-splash"} aria-hidden="true" />
    </>
  );
}
