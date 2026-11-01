import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "./site-footer";

describe("Site footer", () => {
  it("uses Hits last forever under the wordmark", () => {
    render(<SiteFooter />);
    expect(screen.getByText("Hits last forever.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "The Drop" })).toHaveAttribute("href", "/the-drop");
    expect(screen.queryByText(/era that left a mark/i)).not.toBeInTheDocument();
  });
});
