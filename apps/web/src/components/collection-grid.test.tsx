import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { catalogProduct } from "@truepointers/commerce/testing";
import { CollectionGrid, collectionCards } from "./collection-grid";

describe("Legacy collection grid", () => {
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
});
