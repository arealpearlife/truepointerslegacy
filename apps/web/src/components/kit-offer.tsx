import { formatMoney, marketing, type LegacyKitOffer } from "@truepointers/commerce";

export function KitOffer({ kit, pending }: { kit: LegacyKitOffer; pending: boolean }) {
  return (
    <div className="kit-offer" id="kit">
      <p className="house-kicker">{marketing.kitTitle}</p>
      <p className="kit-line">{marketing.kitLine}</p>
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
