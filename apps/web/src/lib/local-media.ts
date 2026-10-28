import type { ImageAsset, Product, Selection, VideoAsset } from "@truepointers/commerce";

// Served from apps/web/public/media. Shopify product media takes precedence once uploaded.
function localVideo(name: string): VideoAsset {
  return { url: `/media/${name}.mp4`, mimeType: "video/mp4", previewImage: null };
}

export const legacyChainVideo = localVideo("legacy-tennis-chain");
const chain2 = localVideo("legacy-chain-2");
const chain3 = localVideo("legacy-chain-3");
const chain4 = localVideo("legacy-chain-4");
const chain5 = localVideo("legacy-chain-5");

export const localChainVideos: readonly VideoAsset[] = [
  legacyChainVideo,
  chain2,
  chain3,
  chain4,
  chain5,
];

export const REPRESENTATIVE_CAPTION = "Representative Legacy footage";

export type PreviewSlot =
  | "home-hero"
  | "flawless-band"
  | "legacy-gallery"
  | "flawless-gallery"
  | "upgrade-panel"
  | "pay-later";

// A fixed shuffle so server and client render the same clip in every slot.
const slotVideos: Record<PreviewSlot, VideoAsset> = {
  "home-hero": chain4,
  "flawless-band": chain5,
  "legacy-gallery": legacyChainVideo,
  "flawless-gallery": chain2,
  "upgrade-panel": chain5,
  "pay-later": chain2,
};

// Rows are stone sizes and columns are lengths; no clip repeats next to itself in the grid.
const configurationVideos: Record<string, VideoAsset> = {
  "3 mm|40 inches": chain3,
  "3 mm|44 inches": chain5,
  "3 mm|48 inches": chain2,
  "4 mm|40 inches": chain4,
  "4 mm|44 inches": legacyChainVideo,
  "4 mm|48 inches": chain3,
  "5 mm|40 inches": chain2,
  "5 mm|44 inches": chain4,
  "5 mm|48 inches": chain5,
};

function stableIndex(key: string): number {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % localChainVideos.length;
}

export function previewVideo(slot: PreviewSlot): VideoAsset {
  return slotVideos[slot];
}

export function configurationPreviewVideo(selection: Selection): VideoAsset {
  const key = `${selection.stoneSize ?? ""}|${selection.chainLength ?? ""}`;
  return configurationVideos[key] ?? keyedPreviewVideo(key);
}

export function keyedPreviewVideo(key: string): VideoAsset {
  return localChainVideos[stableIndex(key)]!;
}

export type DisplayMedia =
  | { kind: "image"; asset: ImageAsset; representative: false }
  | { kind: "video"; asset: VideoAsset; representative: boolean };

// Shopify media always wins; the local clip is only a stand-in until it is uploaded.
export function displayMedia(product: Product | null, slot: PreviewSlot): DisplayMedia {
  const image = product?.images[0];
  if (image) return { kind: "image", asset: image, representative: false };
  const video = product?.videos[0];
  if (video) return { kind: "video", asset: video, representative: false };
  return { kind: "video", asset: previewVideo(slot), representative: true };
}
