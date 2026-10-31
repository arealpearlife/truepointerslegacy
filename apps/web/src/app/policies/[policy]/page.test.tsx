import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PolicyPage from "./page";

describe("Policy pages", () => {
  it("publishes the 15-day return inspection rules", async () => {
    const page = await PolicyPage({ params: Promise.resolve({ policy: "returns" }) });
    render(page);
    expect(screen.getByRole("heading", { name: "Returns and refunds" })).toBeInTheDocument();
    expect(screen.getByText(/15 days from delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/passes return inspection/i)).toBeInTheDocument();
    expect(screen.getByText(/we keep the chain and issue a partial refund/i)).toBeInTheDocument();
    expect(screen.queryByText(/has not been published yet/i)).not.toBeInTheDocument();
  });

  it("prices shipping by distance from Richmond, not weight", async () => {
    const page = await PolicyPage({ params: Promise.resolve({ policy: "shipping" }) });
    render(page);
    expect(screen.getByText(/distance from Richmond/i)).toBeInTheDocument();
    expect(screen.getByText(/start at \$10/i)).toBeInTheDocument();
    expect(screen.getByText(/not priced by weight/i)).toBeInTheDocument();
    expect(screen.getByText(/US orders of \$500 or more ship free/i)).toBeInTheDocument();
    expect(
      screen.getByText(/International orders of \$1,000 or more ship free/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/US orders of \$1,000 or more include a free Legacy necklace/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/\$10 — Closest to Richmond: VA, DC, MD/i)).toBeInTheDocument();
    expect(screen.getByText(/\$40 — Alaska: AK/i)).toBeInTheDocument();
    expect(screen.queryByText(/We do not ship outside the United States/i)).not.toBeInTheDocument();
  });

  it("covers replacements, cleaning, and repair for 5 years", async () => {
    const page = await PolicyPage({ params: Promise.resolve({ policy: "warranty" }) });
    render(page);
    expect(
      screen.getByText(/Free replacements, cleaning, and repair for up to 5 years/i),
    ).toBeInTheDocument();
  });
});
