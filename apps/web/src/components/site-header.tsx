import Link from "next/link";
import { HANDLES } from "@truepointers/commerce";

const legacy = `/products/${HANDLES.legacy}`;

export function SiteHeader({ cartCount }: { cartCount: number }) {
  return (
    <header className="site-header">
      <div className="container utility-bar">
        <Link href="/policies/shipping">Shipping</Link>
        <Link href="/policies/returns">Returns</Link>
        <Link href="/support">Support</Link>
      </div>
      <div className="container masthead">
        <Link className="wordmark" href="/" aria-label="True Pointers home">
          <span className="wordmark-main">TRUE POINTERS</span>
          <span className="wordmark-sub">LEGACY</span>
        </Link>
        <Link className="cart-link" href="/cart">
          Cart{cartCount > 0 ? <span className="cart-count">{cartCount}</span> : null}
        </Link>
        <nav className="nav-group" aria-label="Shop">
          <Link href="/">Home</Link>
          <Link href={legacy}>Legacy</Link>
          <Link href={`${legacy}#fit`}>Fit Guide</Link>
        </nav>
        <nav className="nav-group right" aria-label="Account">
          <Link href={`${legacy}?explore=flawless`}>Flawless Upgrade</Link>
          <Link href="/support">Support</Link>
        </nav>
      </div>
    </header>
  );
}
