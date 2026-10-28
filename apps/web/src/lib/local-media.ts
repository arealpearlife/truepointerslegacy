import type { VideoAsset } from "@truepointers/commerce";

// Served from apps/web/public/media. Shopify product videos take precedence once uploaded.
export const legacyChainVideo: VideoAsset = {
  url: "/media/legacy-tennis-chain.mp4",
  mimeType: "video/mp4",
  previewImage: null,
};
