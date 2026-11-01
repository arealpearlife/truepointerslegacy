import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { discovery } from "@truepointers/commerce";
import TheDropPage from "./page";

describe("The Drop", () => {
  it("makes the extra-long tennis necklace searchable without stuffing the house", () => {
    render(<TheDropPage />);
    expect(screen.getByRole("heading", { name: discovery.dropHeading })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Y2K fashion" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tennis necklace" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Men's jewelry" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hip-hop jewelry" })).toBeInTheDocument();
    expect(screen.getByText(/GLD shop/)).toBeInTheDocument();
    expect(screen.getByText(/Icey Pyramid/)).toBeInTheDocument();
    expect(screen.getByText(/Legacybytp/)).toBeInTheDocument();
    expect(screen.getAllByText(/GLD shop|Icey Pyramid/).length).toBe(1);
  });
});
