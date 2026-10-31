import Link from "next/link";
import { conversionIncentives } from "@truepointers/commerce";

export function IncentiveBanners({ layout = "cards" }: { layout?: "cards" | "strip" | "notes" }) {
  if (layout === "strip") {
    return (
      <nav className="incentive-strip" aria-label="Order incentives">
        <div className="container incentive-strip-list">
          {conversionIncentives.map((item) => (
            <Link key={item.id} href={item.href}>
              <span className="incentive-kicker">{item.kicker}</span>
              <strong>{item.offer}</strong>
            </Link>
          ))}
        </div>
      </nav>
    );
  }

  if (layout === "notes") {
    return (
      <ul className="incentive-notes">
        {conversionIncentives.map((item) => (
          <li key={item.id}>
            <Link href={item.href}>{item.detail}</Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="incentive-banners" aria-label="Order incentives">
      {conversionIncentives.map((item) => (
        <article className="incentive-card" key={item.id}>
          <p className="incentive-kicker">{item.kicker}</p>
          <h2>{item.offer}</h2>
          <p>{item.detail}</p>
          <Link href={item.href}>{item.cta}</Link>
        </article>
      ))}
    </section>
  );
}
