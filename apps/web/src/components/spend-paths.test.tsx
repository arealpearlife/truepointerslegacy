import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectedKitTotal, marketing, parseMoney } from "@truepointers/commerce";
import { SpendPaths } from "./spend-paths";

describe("Spend paths", () => {
  it("offers the $1,000 look and a calm one-chain path", () => {
    render(
      <SpendPaths kitTotal={expectedKitTotal("3 mm")} flawlessFrom={parseMoney("979.00", "USD")} />,
    );
    expect(screen.getByRole("link", { name: marketing.payLaterFlawless })).toHaveAttribute(
      "href",
      "/flawless",
    );
    expect(screen.getByRole("link", { name: marketing.shopKit }).getAttribute("href")).toMatch(
      /\/products\/true-pointers-legacy-extended-tennis-chain\?stone=3(\+|%20)mm#kit/,
    );
    expect(screen.getByRole("link", { name: marketing.shopLegacy })).toBeInTheDocument();
    expect(screen.getByText(/One chain is still a full chain/i)).toBeInTheDocument();
    expect(screen.queryByText(/90%/i)).not.toBeInTheDocument();
  });
});
