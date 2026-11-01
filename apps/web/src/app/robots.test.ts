import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows public indexing of the storefront", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: ["/cart"] },
      sitemap: "https://www.legacybytp.com/sitemap.xml",
      host: "https://www.legacybytp.com",
    });
  });
});
