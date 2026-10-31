import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HANDLES } from "@truepointers/commerce";
import { AnnouncementBar } from "./announcement-bar";
import { IncentiveBanners } from "./incentive-banners";

describe("conversion incentives", () => {
  it("advertises shipping, the gift necklace, and 5-year care in banners", () => {
    render(<IncentiveBanners />);
    expect(screen.getByRole("link", { name: "See shipping" })).toHaveAttribute(
      "href",
      "/policies/shipping",
    );
    expect(screen.getByRole("link", { name: "Shop Legacy" })).toHaveAttribute(
      "href",
      `/products/${HANDLES.legacy}`,
    );
    expect(screen.getByRole("link", { name: "See warranty" })).toHaveAttribute(
      "href",
      "/policies/warranty",
    );
    expect(screen.getByText(/Free shipping at \$1,000/i)).toBeInTheDocument();
    expect(screen.getByText(/Free Legacy necklace at \$1,000/i)).toBeInTheDocument();
    expect(screen.getByText(/5 years of replacements, cleaning, and repair/i)).toBeInTheDocument();
  });

  it("keeps the incentive strip on every page", () => {
    render(<IncentiveBanners layout="strip" />);
    expect(screen.getByRole("navigation", { name: "Order incentives" })).toBeInTheDocument();
    expect(screen.getByText(/Free Legacy necklace at \$1,000/i)).toBeInTheDocument();
  });

  it("scrolls the same offers in the announcement bar", () => {
    render(<AnnouncementBar />);
    expect(screen.getByLabelText("Announcements")).toHaveTextContent(
      /International orders of \$1,000 or more ship free/,
    );
    expect(screen.getByLabelText("Announcements")).toHaveTextContent(
      /US orders of \$1,000 or more include a free Legacy necklace/,
    );
    expect(screen.getByLabelText("Announcements")).toHaveTextContent(
      /Free replacements, cleaning, and repair for 5 years/,
    );
  });
});
