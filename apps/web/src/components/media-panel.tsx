"use client";

import { useState } from "react";
import { marketing, type Product } from "@truepointers/commerce";
import { REPRESENTATIVE_CAPTION, previewVideo } from "@/lib/local-media";
import { PreviewVideo } from "./preview-video";

export function MediaPanel({
  flawless,
  onExplore,
}: {
  flawless: Product | null;
  onExplore: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const video = flawless?.videos[0] ?? previewVideo("upgrade-panel");

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
        <PreviewVideo video={video} label="Flawless Upgrade video" eager controls />
        {flawless?.videos[0] ? null : <p className="caption">{REPRESENTATIVE_CAPTION}</p>}
        <p className="caption">Captions have not been provided for this video.</p>
        <button className="ice wide" type="button" onClick={onExplore}>
          {marketing.flawlessUpgrade}
        </button>
      </div>
    </aside>
  );
}
