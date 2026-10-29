import { describe, expect, it } from "vitest";
import { PUBLIC_SITE_HOST, PUBLIC_SITE_URL } from "@truepointers/commerce";
import { PUBLIC_INDEXING, publicSiteOrigin, publicSiteUrl } from "./site";

describe("public site origin", () => {
  it("uses the www custom domain over localhost", () => {
    expect(PUBLIC_SITE_HOST).toBe("legacybytp.com");
    expect(PUBLIC_SITE_URL).toBe("https://www.legacybytp.com");
    expect(publicSiteOrigin()).toBe("https://www.legacybytp.com");
    expect(publicSiteUrl().origin).toBe("https://www.legacybytp.com");
    expect(PUBLIC_INDEXING).toEqual({ index: true, follow: true });
  });

  it("keeps https origins and rejects unsafe substitutes", () => {
    expect(publicSiteOrigin("https://www.legacybytp.com/shop")).toBe("https://www.legacybytp.com");
    expect(publicSiteOrigin("https://legacybytp.com/shop")).toBe("https://legacybytp.com");
    expect(publicSiteOrigin("http://localhost:3000")).toBe("https://www.legacybytp.com");
    expect(publicSiteOrigin("not-a-url")).toBe("https://www.legacybytp.com");
  });
});
