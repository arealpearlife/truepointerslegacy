import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { parseMoney } from "@truepointers/commerce";
import { PrivilegeMark } from "./privilege-mark";

describe("Privilege mark", () => {
  it("seals the two house courtesies without a $1,000 look lecture", () => {
    render(<PrivilegeMark />);
    expect(screen.getByText(/From \$500/i)).toBeInTheDocument();
    expect(screen.getByText(/5 years of care/i)).toBeInTheDocument();
    expect(screen.getByText(/From \$1,000/i)).toBeInTheDocument();
    expect(screen.getByText(/A Legacy chain, chosen by you/i)).toBeInTheDocument();
    expect(screen.queryByText(/\$1,000 look/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("names the complimentary chain once the bag is at $1,000", () => {
    render(<PrivilegeMark subtotal={parseMoney("1073.00", "USD")} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText(/complimentary Legacy chain of your choice/i)).toBeInTheDocument();
  });
});
