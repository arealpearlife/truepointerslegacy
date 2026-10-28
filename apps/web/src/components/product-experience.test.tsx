import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { marketing } from "@truepointers/commerce";
import { catalogProduct, variantId } from "@truepointers/commerce/testing";
import { idleActionState } from "@/lib/action-state";
import { REPRESENTATIVE_CAPTION, previewVideo } from "@/lib/local-media";
import { ProductExperience } from "./product-experience";

const addToCart = async () => idleActionState;

describe("Legacy product experience", () => {
  it("keeps Legacy selected while Flawless can be opened and dismissed", () => {
    render(
      <ProductExperience
        edition="legacy"
        product={catalogProduct("legacy")}
        flawless={catalogProduct("flawless")}
        initialSelection={{ stoneSize: null, chainLength: null }}
        addToCart={addToCart}
      />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("LEGACY TENNIS CHAIN");
    expect(screen.getByText("LAST FOREVER.")).toBeInTheDocument();
    expect(screen.queryByText(/cubic zirconia/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/moissanite/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/product details/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("3 mm"));
    fireEvent.click(screen.getByLabelText("40 inches"));
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeEnabled();
    expect(screen.getByDisplayValue(variantId("legacy", "3 mm", "40 inches"))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: marketing.flawlessUpgrade })).toHaveAttribute(
      "href",
      "/flawless",
    );
    expect(screen.getByRole("link", { name: /the upgrade/i })).toHaveAttribute("href", "/flawless");
  });

  it("never prints cubic zirconia or moissanite even when Shopify sends those words", () => {
    const legacy = catalogProduct("legacy");
    const flawless = catalogProduct("flawless");
    legacy.description = "Stone material: cubic zirconia.";
    flawless.description = "Stone material: moissanite. This is not a diamond product.";
    render(
      <ProductExperience
        edition="flawless"
        product={flawless}
        flawless={flawless}
        initialSelection={{ stoneSize: null, chainLength: null }}
        addToCart={addToCart}
        payLater
      />,
    );
    expect(screen.queryByText(/cubic zirconia/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/moissanite/i)).not.toBeInTheDocument();
    expect(screen.getByText(/diamond tester/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: marketing.payLaterCta })).toHaveAttribute(
      "value",
      "pay-later",
    );
  });

  it("does not advertise the Flawless starting price when that configuration is unavailable", () => {
    render(
      <ProductExperience
        edition="flawless"
        product={catalogProduct("flawless", false)}
        flawless={catalogProduct("flawless", false)}
        initialSelection={{ stoneSize: null, chainLength: null }}
        addToCart={addToCart}
        payLater
      />,
    );
    expect(screen.queryByText(marketing.fromPrice)).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("3 mm"));
    fireEvent.click(screen.getByLabelText("40 inches"));
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeDisabled();
  });

  it("disables purchase when Shopify has not published the product", () => {
    render(
      <ProductExperience
        edition="legacy"
        product={null}
        flawless={null}
        initialSelection={{ stoneSize: "3 mm", chainLength: "40 inches" }}
        addToCart={addToCart}
      />,
    );
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeDisabled();
    expect(screen.getByText("This piece is not available to purchase yet.")).toBeInTheDocument();
    expect(screen.queryByText("$329")).not.toBeInTheDocument();
  });

  it("plays the uploaded Shopify video in the product image box without autoplaying sound", () => {
    const product = catalogProduct("legacy");
    product.videos = [
      { url: "https://cdn.shopify.com/v/legacy.mp4", mimeType: "video/mp4", previewImage: null },
    ];
    const { container } = render(
      <ProductExperience
        edition="legacy"
        product={product}
        flawless={catalogProduct("flawless")}
        initialSelection={{ stoneSize: null, chainLength: null }}
        addToCart={addToCart}
      />,
    );
    const video = container.querySelector(".gallery video") as HTMLVideoElement;
    expect(video.querySelector("source")).toHaveAttribute("src", product.videos[0]!.url);
    expect(video.muted).toBe(true);
    expect(video.autoplay).toBe(false);
  });

  it("shows the local Legacy video in the image box and Flawless Upgrade panel until Shopify has one", () => {
    const { container } = render(
      <ProductExperience
        edition="legacy"
        product={null}
        flawless={null}
        initialSelection={{ stoneSize: null, chainLength: null }}
        addToCart={addToCart}
      />,
    );
    const gallery = container.querySelector(".gallery video") as HTMLVideoElement;
    const panel = container.querySelector(".panel video") as HTMLVideoElement;
    expect(gallery.querySelector("source")).toHaveAttribute("src", "/media/legacy-chain-5.mp4");
    expect(panel.querySelector("source")).toHaveAttribute("src", "/media/legacy-tennis-chain.mp4");
    expect(gallery.querySelector("source")).toHaveAttribute(
      "src",
      previewVideo("legacy-gallery").url,
    );
    expect(panel.querySelector("source")).toHaveAttribute("src", previewVideo("upgrade-panel").url);
    expect(gallery.muted).toBe(true);
    expect(panel.muted).toBe(true);
    expect(gallery.autoplay).toBe(false);
    expect(panel.autoplay).toBe(false);
  });

  it("shows a representative local video in the Flawless image box until Shopify has media", () => {
    const { container } = render(
      <ProductExperience
        edition="flawless"
        product={null}
        flawless={null}
        initialSelection={{ stoneSize: null, chainLength: null }}
        addToCart={addToCart}
      />,
    );
    const video = container.querySelector(".gallery video") as HTMLVideoElement;
    expect(video.querySelector("source")).toHaveAttribute("src", "/media/legacy-tennis-chain.mp4");
    expect(video.querySelector("source")).toHaveAttribute(
      "src",
      previewVideo("flawless-gallery").url,
    );
    expect(video.muted).toBe(true);
    expect(video.autoplay).toBe(false);
    expect(screen.getByText(REPRESENTATIVE_CAPTION)).toBeInTheDocument();
  });

  it("plays the sparkle clip on the pay-later Flawless page until Shopify has media", () => {
    const { container } = render(
      <ProductExperience
        edition="flawless"
        product={null}
        flawless={null}
        initialSelection={{ stoneSize: null, chainLength: null }}
        addToCart={addToCart}
        payLater
      />,
    );
    const video = container.querySelector(".gallery video") as HTMLVideoElement;
    expect(video.querySelector("source")).toHaveAttribute("src", "/media/legacy-tennis-chain.mp4");
    expect(video.querySelector("source")).toHaveAttribute("src", previewVideo("pay-later").url);
  });

  it("shows the Shopify product image instead of the local video", () => {
    const product = catalogProduct("flawless");
    product.images = [
      {
        url: "https://cdn.shopify.com/s/flawless.jpg",
        altText: "Flawless",
        width: 800,
        height: 800,
      },
    ];
    const { container } = render(
      <ProductExperience
        edition="flawless"
        product={product}
        flawless={product}
        initialSelection={{ stoneSize: null, chainLength: null }}
        addToCart={addToCart}
      />,
    );
    expect(container.querySelector(".gallery video")).toBeNull();
    expect(container.querySelector(".gallery img")).toHaveAttribute("src", product.images[0]!.url);
    expect(screen.queryByText(REPRESENTATIVE_CAPTION)).not.toBeInTheDocument();
  });

  it("replaces the comparison table with a fit guide that follows the chosen length", () => {
    render(
      <ProductExperience
        edition="legacy"
        product={catalogProduct("legacy")}
        flawless={catalogProduct("flawless")}
        initialSelection={{ stoneSize: "4 mm", chainLength: "40 inches" }}
        addToCart={addToCart}
      />,
    );
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    const guide = screen.getByRole("region", { name: /where it hits/i });
    expect(within(guide).getByRole("img")).toHaveAccessibleName(/40, 44, and 48 inch/);
    expect(within(guide).getByRole("button", { name: /40" Mid-abs/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(within(guide).getByRole("button", { name: /48" Toward the waistband/ }));
    expect(screen.getByLabelText("48 inches")).toBeChecked();
    expect(screen.getByDisplayValue(variantId("legacy", "4 mm", "48 inches"))).toBeInTheDocument();
  });
});
