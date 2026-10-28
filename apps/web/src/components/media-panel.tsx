"use client";

import { useState } from "react";
import { marketing, type Product } from "@truepointers/commerce";
import { Placeholder } from "./placeholder";

export function MediaPanel({
  flawless,
  onExplore,
}: {
  flawless: Product | null;
  onExplore: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const video = flawless?.videos[0] ?? null;

  return (
    <aside
      className="panel"
      data-expanded={expanded ? "true" : "false"}
      aria-label="Flawless Upgrade"
    >
      <button
        className="panel-toggle"
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? "Hide the Flawless Upgrade" : "See the Flawless Upgrade"}
      </button>
      <div className="panel-body">
        <p className="panel-label">{marketing.flawlessUpgrade}</p>
        {video ? (
          <>
            <video controls playsInline preload="metadata" src={video.url} />
            <p className="caption">Captions have not been provided for this video.</p>
          </>
        ) : (
          <Placeholder label="The Flawless product video will appear here after it is uploaded in Shopify Admin." />
        )}
        <button className="ice wide" type="button" onClick={onExplore}>
          {marketing.flawlessUpgrade}
        </button>
      </div>
    </aside>
  );
}
