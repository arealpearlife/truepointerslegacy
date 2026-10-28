import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { catalogProduct } from "@truepointers/commerce/testing";
import { REPRESENTATIVE_CAPTION, localChainVideos } from "@/lib/local-media";
import { CollectionGrid, collectionCards } from "./collection-grid";

describe("Legacy collection grid", () => {
  it("lays the nine configurations out as a lookbook instead of a uniform catalog grid", () => {
    const { container } = render(<CollectionGrid product={null} />);
    expect(container.querySelector("ul.lookbook")).not.toBeNull();
    expect(screen.getAllByRole("listitem").map((item) => item.getAttribute("data-slot"))).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ]);
  });

  it("shows no prices when Shopify has not published the catalog", () => {
    render(<CollectionGrid product={null} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(9);
    expect(screen.getAllByText("Price set at launch")).toHaveLength(9);
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
    expect(screen.getAllByText("Not yet available")).toHaveLength(9);
  });

  it("uses Shopify prices and links each card to its exact configuration", () => {
    const cards = collectionCards(catalogProduct("legacy", true));
    expect(cards.map((card) => card.price)).toEqual([
      "$329",
      "$369",
      "$375",
      "$417",
      "$457",
      "$465",
      "$421",
      "$458",
      "$488",
    ]);
    render(<CollectionGrid product={catalogProduct("legacy", true)} />);
    expect(screen.getByRole("link", { name: /3MM × 40"/ })).toHaveAttribute(
      "href",
      "/products/true-pointers-legacy-extended-tennis-chain?stone=3+mm&length=40+inches",
    );
    expect(screen.queryByText("Not yet available")).not.toBeInTheDocument();
  });

  it("shows a muted local chain video on every card until Shopify has media", () => {
    const { container } = render(<CollectionGrid product={null} />);
    const videos = Array.from(container.querySelectorAll<HTMLVideoElement>(".card-media video"));
    const pool = localChainVideos.map((video) => video.url);
    expect(videos).toHaveLength(9);
    for (const video of videos) {
      expect(pool).toContain(video.querySelector("source")?.getAttribute("src"));
      expect(video.muted).toBe(true);
      expect(video.autoplay).toBe(false);
      expect(video).toHaveAttribute("preload", "none");
    }
    const used = new Set(videos.map((video) => video.querySelector("source")?.getAttribute("src")));
    expect(used.size).toBe(pool.length);
    expect(screen.getAllByText(REPRESENTATIVE_CAPTION)).toHaveLength(9);
  });

  it("uses the Shopify image instead of the local video once one is uploaded", () => {
    const product = catalogProduct("legacy", true);
    product.images = [
      { url: "https://cdn.shopify.com/s/legacy.jpg", altText: "Legacy", width: 800, height: 800 },
    ];
    const { container } = render(<CollectionGrid product={product} />);
    expect(container.querySelector(".card-media video")).toBeNull();
    expect(container.querySelectorAll(".card-media img")).toHaveLength(9);
    expect(screen.queryByText(REPRESENTATIVE_CAPTION)).not.toBeInTheDocument();
  });

  it("uses the Shopify product video instead of the local clips", () => {
    const product = catalogProduct("legacy", true);
    product.videos = [
      { url: "https://cdn.shopify.com/v/legacy.mp4", mimeType: "video/mp4", previewImage: null },
    ];
    expect(collectionCards(product).every((card) => card.video === product.videos[0])).toBe(true);
  });
});
