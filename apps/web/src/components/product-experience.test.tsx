import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { marketing } from "@truepointers/commerce";
import { catalogProduct, variantId } from "@truepointers/commerce/testing";
import { idleActionState } from "@/lib/action-state";
import { legacyChainVideo } from "@/lib/local-media";
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
        initialModalOpen={false}
        addToCart={addToCart}
      />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("LEGACY TENNIS CHAIN");
    expect(screen.getByText("THAT LEAVE A MARK.")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("3 mm"));
    fireEvent.click(screen.getByLabelText("40 inches"));
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeEnabled();
    expect(screen.getByDisplayValue(variantId("legacy", "3 mm", "40 inches"))).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: marketing.flawlessUpgrade })[0]!);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent(marketing.modalTitle);
    expect(dialog).toHaveTextContent(marketing.fromPrice);
    expect(screen.queryByRole("button", { name: "Add to cart", hidden: true })).toBeInTheDocument();
    expect(dialog.querySelector("button.primary, button[name='variantId']")).toBeNull();
    expect(screen.getByDisplayValue(variantId("legacy", "3 mm", "40 inches"))).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: marketing.keepLegacy }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue(variantId("legacy", "3 mm", "40 inches"))).toBeInTheDocument();
  });

  it("does not advertise the Flawless starting price when that configuration is unavailable", () => {
    render(
      <ProductExperience
        edition="legacy"
        product={catalogProduct("legacy")}
        flawless={catalogProduct("flawless", false)}
        initialSelection={{ stoneSize: null, chainLength: null }}
        initialModalOpen
        addToCart={addToCart}
      />,
    );
    expect(screen.getByRole("dialog")).not.toHaveTextContent(marketing.fromPrice);
    fireEvent.click(screen.getByLabelText("3 mm"));
    fireEvent.click(screen.getByLabelText("40 inches"));
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeEnabled();
  });

  it("disables purchase when Shopify has not published the product", () => {
    render(
      <ProductExperience
        edition="legacy"
        product={null}
        flawless={null}
        initialSelection={{ stoneSize: "3 mm", chainLength: "40 inches" }}
        initialModalOpen={false}
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
        initialModalOpen={false}
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
        initialModalOpen={false}
        addToCart={addToCart}
      />,
    );
    for (const selector of [".gallery video", ".panel video"]) {
      const video = container.querySelector(selector) as HTMLVideoElement;
      expect(video.querySelector("source")).toHaveAttribute("src", legacyChainVideo.url);
      expect(video.muted).toBe(true);
      expect(video.autoplay).toBe(false);
    }
  });

  it("replaces the comparison table with a fit guide that follows the chosen length", () => {
    render(
      <ProductExperience
        edition="legacy"
        product={catalogProduct("legacy")}
        flawless={catalogProduct("flawless")}
        initialSelection={{ stoneSize: "4 mm", chainLength: "40 inches" }}
        initialModalOpen={false}
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
