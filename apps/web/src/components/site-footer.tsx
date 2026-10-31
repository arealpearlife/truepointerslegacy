import Link from "next/link";
import { HANDLES, marketing } from "@truepointers/commerce";

const legacy = `/products/${HANDLES.legacy}`;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-mark poster">TRUE POINTERS</p>
          <p className="footer-tag">{marketing.footerTag}</p>
        </div>
        <nav aria-label="Shop">
          <h2>Shop</h2>
          <ul>
            <li>
              <Link href={legacy}>{marketing.navChain}</Link>
            </li>
            <li>
              <Link href="/flawless">Flawless Upgrade</Link>
            </li>
            <li>
              <Link href={`${legacy}#fit`}>{marketing.navDrop}</Link>
            </li>
            <li>
              <Link href="/cart">{marketing.navTray}</Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Help">
          <h2>Help</h2>
          <ul>
            <li>
              <Link href="/support">Support</Link>
            </li>
            <li>
              <Link href="/policies/shipping">Shipping</Link>
            </li>
            <li>
              <Link href="/policies/returns">Returns and refunds</Link>
            </li>
            <li>
              <Link href="/policies/care">Care</Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Policies">
          <h2>Policies</h2>
          <ul>
            <li>
              <Link href="/policies/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/policies/terms">Terms</Link>
            </li>
            <li>
              <Link href="/policies/warranty">Warranty</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container footer-legal">
        <p>
          legacybytp.com · Prices exclude shipping and applicable taxes. Checkout is completed with
          Shopify.
        </p>
      </div>
    </footer>
  );
}
