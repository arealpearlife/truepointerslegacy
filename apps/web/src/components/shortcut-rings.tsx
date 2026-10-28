import Link from "next/link";
import { APPROVED_CHAIN_LENGTHS, APPROVED_STONE_SIZES, HANDLES } from "@truepointers/commerce";
import { lengthLabel, stoneLabel } from "@/lib/labels";

const legacy = `/products/${HANDLES.legacy}`;

const shortcuts = [
  { href: legacy, ring: "TP", label: "Legacy" },
  ...APPROVED_STONE_SIZES.map((size) => ({
    href: `${legacy}?stone=${encodeURIComponent(size)}`,
    ring: stoneLabel(size),
    label: `${stoneLabel(size)} stones`,
  })),
  ...APPROVED_CHAIN_LENGTHS.map((length) => ({
    href: `${legacy}?length=${encodeURIComponent(length)}`,
    ring: lengthLabel(length),
    label: `${lengthLabel(length)} length`,
  })),
  { href: `${legacy}#compare`, ring: "VS", label: "Compare" },
  { href: `${legacy}?explore=flawless`, ring: "F", label: "Flawless", tone: "flawless" },
];

export function ShortcutRings() {
  return (
    <nav className="rings" aria-label="Shop by configuration">
      <ul className="container">
        {shortcuts.map((shortcut) => (
          <li key={shortcut.label}>
            <Link href={shortcut.href}>
              <span
                className={shortcut.tone === "flawless" ? "ring flawless poster" : "ring poster"}
                aria-hidden="true"
              >
                {shortcut.ring}
              </span>
              {shortcut.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
