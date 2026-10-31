import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { marketing } from "@truepointers/commerce";
import { DesireBeat } from "./desire-beat";

describe("Desire beat", () => {
  it("places a short want line without a $1,000 look lecture", () => {
    render(<DesireBeat line={marketing.desireCollection} />);
    expect(screen.getByText(marketing.desireCollection)).toBeInTheDocument();
    expect(screen.queryByText(/\$1,000 look/i)).not.toBeInTheDocument();
  });
});
