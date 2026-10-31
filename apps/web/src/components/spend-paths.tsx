import Link from "next/link";
import {
  HANDLES,
  configurationHref,
  formatMoney,
  marketing,
  type Money,
} from "@truepointers/commerce";
import { PayLaterStrip } from "./pay-later-strip";

export function SpendPaths({
  kitTotal,
  flawlessFrom,
}: {
  kitTotal: Money | null;
  flawlessFrom: Money | null;
}) {
  const kitHref = `${configurationHref(HANDLES.legacy, { stoneSize: "3 mm", chainLength: null })}#kit`;
  return (
    <section className="spend-paths" aria-label="How to buy">
      <article className="spend-card spend-card-target">
        <p className="incentive-kicker">{marketing.thousandLook}</p>
        <h2>{marketing.kitLine}</h2>
        <p>{marketing.thousandBody}</p>
        <p className="spend-price">
          {flawlessFrom ? `Flawless from ${formatMoney(flawlessFrom)}` : "Flawless"}
          {kitTotal ? ` · Kit from ${formatMoney(kitTotal)}` : ""}
        </p>
        <PayLaterStrip compact />
        <div className="actions">
          <Link className="button ice" href="/flawless">
            {marketing.payLaterFlawless}
          </Link>
          <Link className="button solid-white" href={kitHref}>
            {marketing.shopKit}
          </Link>
        </div>
      </article>
      <article className="spend-card spend-card-safe">
        <p className="incentive-kicker">{marketing.usShipLine}</p>
        <h2>{marketing.oneChainTitle}</h2>
        <p>{marketing.oneChainBody}</p>
        <div className="actions">
          <Link className="button outline-ink" href={`/products/${HANDLES.legacy}`}>
            {marketing.shopLegacy}
          </Link>
        </div>
      </article>
    </section>
  );
}
