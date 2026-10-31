import { formatMoney, marketing, spendProgress, type Money } from "@truepointers/commerce";
import { PayLaterStrip } from "./pay-later-strip";

export function SpendLadder({ subtotal }: { subtotal: Money }) {
  const progress = spendProgress(subtotal.cents);
  const thousand = Math.min(100, Math.round((subtotal.cents / 100000) * 100));
  return (
    <section className="spend-ladder" aria-label="Order progress">
      <p className="spend-ladder-total">Subtotal {formatMoney(subtotal)}</p>
      <div
        className="spend-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={1000}
        aria-valuenow={Math.min(1000, Math.round(subtotal.cents / 100))}
        aria-label="Progress toward the $1,000 look"
      >
        <span className="spend-fill" style={{ width: `${thousand}%` }} />
        <span className="spend-mark" style={{ left: "50%" }} title="US free shipping at $500" />
      </div>
      <p>{progress.message}</p>
      <PayLaterStrip compact />
      <p className="note">{marketing.payLaterEase}</p>
    </section>
  );
}
