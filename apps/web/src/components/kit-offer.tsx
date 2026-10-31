import { formatMoney, marketing, type LegacyKitOffer } from "@truepointers/commerce";

export function KitOffer({ kit, pending }: { kit: LegacyKitOffer; pending: boolean }) {
  return (
    <div className="kit-offer" id="kit">
      <p className="incentive-kicker">{marketing.kitTitle}</p>
      <h2>{marketing.kitLine}</h2>
      <p>{marketing.kitBody}</p>
      <p className="spend-price">
        {kit.stoneSize} · {kit.lengths.join(" · ")}
        {kit.total ? ` · ${formatMoney(kit.total)}` : ""}
      </p>
      <button
        className="primary wide"
        type="submit"
        name="intent"
        value="kit"
        disabled={!kit.ready || pending}
      >
        {pending ? "Adding" : marketing.kitCta}
      </button>
      <button
        className="ice wide"
        type="submit"
        name="intent"
        value="pay-later-kit"
        disabled={!kit.ready || pending}
      >
        {pending ? "Adding" : marketing.kitPayLaterCta}
      </button>
    </div>
  );
}
