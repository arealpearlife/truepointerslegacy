import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { marketing } from "@truepointers/commerce";
import { HouseCourtesy } from "./house-courtesy";

describe("House courtesy", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps jewelry first, then offers a small courtesy instead of deal cards", () => {
    render(<HouseCourtesy />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("House courtesies")).toBeInTheDocument();
    expect(screen.queryByText(/\$1,000 look/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/full chain/i)).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4500);
    });

    expect(screen.getByRole("dialog", { name: marketing.houseCourtesyLead })).toBeInTheDocument();
    expect(screen.getByText(/5 years of care/i)).toBeInTheDocument();
    expect(screen.getByText(/A Legacy chain, chosen by you/i)).toBeInTheDocument();
  });
});
