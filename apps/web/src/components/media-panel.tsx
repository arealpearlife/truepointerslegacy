import Link from "next/link";
import { marketing, type Product } from "@truepointers/commerce";
import { REPRESENTATIVE_CAPTION, previewVideo } from "@/lib/local-media";
import { PayLaterStrip } from "./pay-later-strip";
import { PreviewVideo } from "./preview-video";

export function MediaPanel({ flawless }: { flawless: Product | null }) {
  const video = flawless?.videos[0] ?? previewVideo("upgrade-panel");

  return (
    <aside className="panel pay-later-card" aria-label={marketing.payLaterTitle}>
      <Link className="pay-later-hit" href="/flawless">
        <p className="panel-label">{marketing.flawlessKicker}</p>
        <p className="poster pay-later-mark">{marketing.payLaterTitle}</p>
        <p className="pay-later-heat">{marketing.flawlessHeat}</p>
        <div className="pay-later-thumb">
          <PreviewVideo video={video} label="Flawless necklace" />
          {flawless?.videos[0] ? null : (
            <span className="media-note">{REPRESENTATIVE_CAPTION}</span>
          )}
        </div>
        <p className="pay-later-cut">{marketing.flawlessLine}</p>
        <PayLaterStrip compact />
      </Link>
    </aside>
  );
}
