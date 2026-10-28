import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteHeader } from "./site-header";

describe("Site header", () => {
  it("keeps the cart on its own control so the phone masthead can sit off-center", () => {
    render(<SiteHeader cartCount={2} />);
    const cart = screen.getByRole("link", { name: /cart/i });
    expect(cart).toHaveClass("cart-link");
    expect(cart.closest("nav")).toBeNull();
    expect(cart).toHaveTextContent("2");
    expect(screen.getByLabelText("True Pointers home")).toHaveClass("wordmark");
  });
});
