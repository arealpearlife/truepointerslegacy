import { describe, expect, it } from "vitest";
import { discovery } from "@truepointers/commerce";
import { FACEBOOK_PAGE_URL, absoluteUrl, organizationGraph, pageMetadata } from "./seo";

describe("search metadata", () => {
  it("names Legacybytp and the extra-long tennis necklace", () => {
    const meta = pageMetadata({
      title: discovery.homeTitle,
      description: discovery.homeDescription,
      path: "/",
    });
    expect(meta.title).toMatch(/Legacybytp/);
    expect(meta.description).toMatch(/tennis necklace/i);
    expect(meta.description).toMatch(/Y2K/i);
    expect(meta.keywords).toEqual(
      expect.arrayContaining(["y2k", "tennis necklace", "mens jewelry", "hiphop jewelry"]),
    );
    expect(meta.alternates.canonical).toBe("/");
    expect(meta.openGraph.siteName).toBe("True Pointers Legacy");
  });

  it("publishes the house as a jewelry store at the public origin", () => {
    const graph = organizationGraph();
    const house = graph["@graph"][0] as { alternateName: string[]; sameAs: string[] };
    expect(absoluteUrl("/the-drop")).toBe("https://www.legacybytp.com/the-drop");
    expect(house.alternateName).toContain("Legacybytp");
    expect(house.sameAs).toEqual([FACEBOOK_PAGE_URL]);
  });
});
