import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Motto } from "./motto";

describe("Motto", () => {
  it("says Hits Last Forever and drops the old era line", () => {
    render(<Motto />);
    expect(screen.getByText("HITS")).toBeInTheDocument();
    expect(screen.getByText("LAST FOREVER.")).toBeInTheDocument();
    expect(screen.queryByText(/era that left a mark/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/a legacy\./i)).not.toBeInTheDocument();
  });
});
