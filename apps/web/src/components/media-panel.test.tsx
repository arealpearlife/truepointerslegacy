import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { marketing } from "@truepointers/commerce";
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
});
