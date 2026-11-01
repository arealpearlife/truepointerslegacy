"use client";

import { useEffect, useState } from "react";
import { climateAt, formatTrayTemp, readClimateStart, type IceClimate } from "@/lib/ice-climate";

const idle: IceClimate = climateAt(0);

export function IceClimate() {
  const [climate, setClimate] = useState<IceClimate>(idle);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (motion.matches) {
        setReduced(true);
        return;
      }
    }
    const start = readClimateStart(Date.now(), window.sessionStorage);
    const tick = () => {
      const next = climateAt(Date.now() - start);
      setClimate(next);
      document.documentElement.style.setProperty("--ice-depth", next.intensity.toFixed(3));
      document.documentElement.dataset.ice = next.started ? "cold" : "cool";
    };
    tick();
    const pulse = window.setInterval(tick, 250);
    return () => {
      window.clearInterval(pulse);
      document.documentElement.style.removeProperty("--ice-depth");
      delete document.documentElement.dataset.ice;
    };
  }, []);

  if (reduced) return null;

  return (
    <>
      <div className="ice-rise" aria-hidden="true" />
      <div className="ice-pane" aria-hidden="true" />
      {climate.started ? (
        <p className="tray-temp" aria-live="polite">
          <span>Tray temp</span>
          <strong>{formatTrayTemp(climate.celsius)}</strong>
        </p>
      ) : null}
    </>
  );
}
