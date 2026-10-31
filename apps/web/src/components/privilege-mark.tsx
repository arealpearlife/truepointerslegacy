import { formatMoney, housePrivileges, spendProgress, type Money } from "@truepointers/commerce";
import Link from "next/link";

export function PrivilegeMark({ subtotal }: { subtotal?: Money }) {
  const progress = spendProgress(subtotal?.cents ?? 0);
  const gift = Math.min(100, Math.round(((subtotal?.cents ?? 0) / 100000) * 100));
  return (
    <section className="privilege-mark" aria-label="House courtesies">
      {subtotal ? <p className="privilege-total">Subtotal {formatMoney(subtotal)}</p> : null}
      {subtotal ? (
        <div
          className="privilege-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={1000}
          aria-valuenow={Math.min(1000, Math.round(subtotal.cents / 100))}
          aria-label="Progress toward house courtesies"
        >
          <span className="privilege-fill" style={{ width: `${gift}%` }} />
          <span
            className="privilege-notch"
            style={{ left: "50%" }}
            title={housePrivileges[0]!.offer}
          />
        </div>
      ) : null}
      <ul className="privilege-seals">
        {housePrivileges.map((item) => (
          <li key={item.id}>
            <Link href={item.href}>
              <span>{item.kicker}</span>
              <strong>{item.offer}</strong>
            </Link>
          </li>
        ))}
      </ul>
      {subtotal ? <p className="privilege-message">{progress.message}</p> : null}
    </section>
  );
}
