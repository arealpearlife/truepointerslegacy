import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { APPROVED_CHAIN_LENGTHS, APPROVED_STONE_SIZES } from "@truepointers/commerce";
import { catalogProduct } from "@truepointers/commerce/testing";
import {
  configurationPreviewVideo,
  displayMedia,
  keyedPreviewVideo,
  localChainVideos,
  previewVideo,
} from "./local-media";

describe("local preview media", () => {
  it("points every pooled clip at a file in public/media", () => {
    expect(localChainVideos).toHaveLength(5);
    for (const video of localChainVideos) {
      expect(existsSync(join(__dirname, "../../public", video.url))).toBe(true);
    }
  });

  it("gives every approved configuration a pooled clip and uses all five", () => {
    const urls = APPROVED_STONE_SIZES.flatMap((stoneSize) =>
      APPROVED_CHAIN_LENGTHS.map(
        (chainLength) => configurationPreviewVideo({ stoneSize, chainLength }).url,
      ),
    );
    expect(new Set(urls)).toEqual(new Set(localChainVideos.map((video) => video.url)));
    expect(keyedPreviewVideo("Legacy")).toBe(keyedPreviewVideo("Legacy"));
  });

  it("swaps the home Legacy clip with the Flawless band clip", () => {
    expect(previewVideo("home-hero").url).toBe("/media/legacy-chain-5.mp4");
    expect(previewVideo("flawless-band").url).toBe("/media/legacy-chain-4.mp4");
    expect(previewVideo("home-hero").url).not.toBe(previewVideo("flawless-band").url);
  });

  it("puts the sparkle clip on product-page Flawless and the flatter clip beside Legacy", () => {
    expect(previewVideo("legacy-gallery").url).toBe("/media/legacy-chain-5.mp4");
    expect(previewVideo("upgrade-panel").url).toBe("/media/legacy-tennis-chain.mp4");
    expect(previewVideo("flawless-gallery").url).toBe("/media/legacy-tennis-chain.mp4");
    expect(previewVideo("pay-later").url).toBe("/media/legacy-tennis-chain.mp4");
    expect(previewVideo("legacy-gallery").url).toBe(previewVideo("home-hero").url);
    expect(previewVideo("legacy-gallery").url).not.toBe(previewVideo("upgrade-panel").url);
  });

  it("prefers Shopify images, then Shopify videos, over the local clip", () => {
    expect(displayMedia(null, "home-hero")).toMatchObject({ kind: "video", representative: true });

    const product = catalogProduct("legacy");
    const video = {
      url: "https://cdn.shopify.com/v/a.mp4",
      mimeType: "video/mp4",
      previewImage: null,
    };
    product.videos = [video];
    expect(displayMedia(product, "home-hero")).toEqual({
      kind: "video",
      asset: video,
      representative: false,
    });

    const image = { url: "https://cdn.shopify.com/s/a.jpg", altText: null, width: 1, height: 1 };
    product.images = [image];
    expect(displayMedia(product, "home-hero")).toEqual({
      kind: "image",
      asset: image,
      representative: false,
    });
  });
});
