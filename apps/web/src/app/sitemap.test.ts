import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists the shop, the drop, and both tennis necklaces", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://www.legacybytp.com");
    expect(urls).toContain("https://www.legacybytp.com/the-drop");
    expect(urls).toContain(
      "https://www.legacybytp.com/products/true-pointers-legacy-extended-tennis-chain",
    );
    expect(urls).toContain(
      "https://www.legacybytp.com/products/true-pointers-flawless-extended-tennis-chain",
    );
    expect(urls).not.toContain("https://www.legacybytp.com/cart");
  });
});
