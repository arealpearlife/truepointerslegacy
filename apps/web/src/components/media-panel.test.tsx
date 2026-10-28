import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { marketing } from "@truepointers/commerce";
import { catalogProduct } from "@truepointers/commerce/testing";
import { previewVideo } from "@/lib/local-media";
import { MediaPanel } from "./media-panel";

describe("Flawless upgrade box", () => {
  it("reads as the ice upgrade and opens the pay-later page", () => {
    render(<MediaPanel flawless={null} />);
    const link = screen.getByRole("link", { name: /the upgrade/i });
    expect(link).toHaveAttribute("href", "/flawless");
    expect(link).toHaveTextContent(marketing.payLaterTitle);
    expect(link).toHaveTextContent(marketing.flawlessHeat);
    expect(link).toHaveTextContent(/harder ice/i);
    expect(link).toHaveTextContent(/buy now, pay later/i);
    expect(link).toHaveTextContent(/Klarna/);
    expect(link).toHaveTextContent(/Afterpay/);
    expect(link).toHaveTextContent(/Shop Pay/);
    expect(
      screen.queryByRole("button", { name: /see the flawless upgrade/i }),
    ).not.toBeInTheDocument();
  });

  it("plays the sparkle clip in the ice ticket until Shopify has a Flawless video", () => {
    const { container } = render(<MediaPanel flawless={null} />);
    expect(container.querySelector("source")).toHaveAttribute(
      "src",
      "/media/legacy-tennis-chain.mp4",
    );
    expect(container.querySelector("source")).toHaveAttribute(
      "src",
      previewVideo("upgrade-panel").url,
    );
  });

  it("uses the Shopify Flawless video when one is uploaded", () => {
    const flawless = catalogProduct("flawless");
    flawless.videos = [
      { url: "https://cdn.shopify.com/v/flawless.mp4", mimeType: "video/mp4", previewImage: null },
    ];
    const { container } = render(<MediaPanel flawless={flawless} />);
    expect(container.querySelector("source")).toHaveAttribute("src", flawless.videos[0]!.url);
  });
});
