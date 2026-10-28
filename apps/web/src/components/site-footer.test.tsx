import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "./site-footer";

describe("Site footer", () => {
  it("uses the hits-that-leave-a-mark line under the wordmark", () => {
    render(<SiteFooter />);
    expect(screen.getByText("Hits that leave a mark.")).toBeInTheDocument();
    expect(screen.queryByText(/era that left a mark/i)).not.toBeInTheDocument();
  });
});
