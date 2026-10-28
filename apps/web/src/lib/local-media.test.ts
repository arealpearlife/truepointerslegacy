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
