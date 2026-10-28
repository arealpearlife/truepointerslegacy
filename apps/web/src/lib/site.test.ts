import { describe, expect, it } from "vitest";
import { PUBLIC_SITE_HOST, PUBLIC_SITE_URL } from "@truepointers/commerce";
import { publicSiteOrigin, publicSiteUrl } from "./site";

describe("public site origin", () => {
  it("uses the purchased custom domain over localhost", () => {
    expect(PUBLIC_SITE_HOST).toBe("legacybytp.com");
    expect(PUBLIC_SITE_URL).toBe("https://legacybytp.com");
    expect(publicSiteOrigin()).toBe("https://legacybytp.com");
    expect(publicSiteUrl().origin).toBe("https://legacybytp.com");
  });

  it("keeps https origins and rejects unsafe substitutes", () => {
    expect(publicSiteOrigin("https://legacybytp.com/shop")).toBe("https://legacybytp.com");
    expect(publicSiteOrigin("http://localhost:3000")).toBe("https://legacybytp.com");
    expect(publicSiteOrigin("not-a-url")).toBe("https://legacybytp.com");
  });
});
