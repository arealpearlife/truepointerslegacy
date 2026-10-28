import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { marketing } from "@truepointers/commerce";
import { MediaPanel } from "./media-panel";

describe("Flawless upgrade box", () => {
  it("opens the buy-now-pay-later page instead of expanding in place", () => {
    render(<MediaPanel flawless={null} />);
    const link = screen.getByRole("link", { name: new RegExp(marketing.payLaterLine, "i") });
    expect(link).toHaveAttribute("href", "/flawless");
    expect(link).toHaveTextContent(/flawless shine/i);
    expect(link).toHaveTextContent(/buy now, pay later/i);
    expect(link).toHaveTextContent(/Klarna/);
    expect(link).toHaveTextContent(/Afterpay/);
    expect(link).toHaveTextContent(/Shop Pay/);
    expect(screen.queryByRole("button", { name: /see the flawless upgrade/i })).not.toBeInTheDocument();
  });
});
