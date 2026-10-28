import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { marketing } from "@truepointers/commerce";
import { catalogProduct, variantId } from "@truepointers/commerce/testing";
import { idleActionState } from "@/lib/action-state";
import { ProductExperience } from "./product-experience";

const addToCart = async () => idleActionState;

describe("Legacy product experience", () => {
  it("keeps Legacy selected while Flawless can be opened and dismissed", () => {
    render(
      <ProductExperience
        edition="legacy"
        product={catalogProduct("legacy")}
        legacy={catalogProduct("legacy")}
        flawless={catalogProduct("flawless")}
        initialSelection={{ stoneSize: null, chainLength: null }}
        initialModalOpen={false}
        addToCart={addToCart}
      />,
    );

    fireEvent.click(screen.getByLabelText("3 mm"));
    fireEvent.click(screen.getByLabelText("40 inches"));
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeEnabled();
    expect(screen.getByDisplayValue(variantId("legacy", "3 mm", "40 inches"))).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: marketing.exploreFlawless })[0]!);
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
        legacy={catalogProduct("legacy")}
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
        legacy={null}
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
});
