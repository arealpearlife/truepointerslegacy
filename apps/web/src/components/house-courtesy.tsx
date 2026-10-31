"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { housePrivileges, marketing } from "@truepointers/commerce";

const COURTESY_KEY = "legacy-house-courtesy";

export function HouseCourtesy() {
  const titleId = useId();
  const [face, setFace] = useState(0);
  const [surprise, setSurprise] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(motion.matches);
    syncMotion();
    motion.addEventListener("change", syncMotion);
    return () => motion.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(COURTESY_KEY)) return;
    const wait = window.setTimeout(() => setSurprise(true), 4500);
    return () => window.clearTimeout(wait);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const tick = window.setInterval(() => {
      setFace((current) => (current + 1) % housePrivileges.length);
    }, 7000);
    return () => window.clearInterval(tick);
  }, [reducedMotion]);

  function dismiss() {
    sessionStorage.setItem(COURTESY_KEY, "1");
    setSurprise(false);
  }

  const privilege = housePrivileges[face] ?? housePrivileges[0]!;

  return (
    <>
      {surprise ? (
        <div className="house-surprise" role="dialog" aria-modal="false" aria-labelledby={titleId}>
          <p className="house-kicker">{marketing.houseCourtesyTitle}</p>
          <p className="house-title" id={titleId}>
            {marketing.houseCourtesyLead}
          </p>
          <ul className="house-list">
            {housePrivileges.map((item) => (
              <li key={item.id}>
                <Link href={item.href} onClick={dismiss}>
                  <span>{item.kicker}</span>
                  <strong>{item.offer}</strong>
                </Link>
              </li>
            ))}
          </ul>
          <button className="house-close" type="button" onClick={dismiss}>
            {marketing.close}
          </button>
        </div>
      ) : (
        <aside className="house-rail" aria-label="House courtesies">
          {reducedMotion ? (
            <div className="house-rail-stack">
              {housePrivileges.map((item) => (
                <Link className="house-rail-face" key={item.id} href={item.href}>
                  <span className="house-kicker">{item.kicker}</span>
                  <strong>{item.offer}</strong>
                </Link>
              ))}
            </div>
          ) : (
            <Link className="house-rail-face" href={privilege.href}>
              <span className="house-kicker">{privilege.kicker}</span>
              <strong>{privilege.offer}</strong>
              <span className="house-whisper">{privilege.whisper}</span>
            </Link>
          )}
        </aside>
      )}
    </>
  );
}
