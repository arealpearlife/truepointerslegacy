import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IceClimate } from "./ice-climate";

describe("Ice climate widget", () => {
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
    document.documentElement.style.removeProperty("--ice-depth");
    delete document.documentElement.dataset.ice;
  });

  it("stays clear for ten seconds, then frosts and drops the tray below freezing", () => {
    render(<IceClimate />);
    expect(screen.queryByText("Tray temp")).not.toBeInTheDocument();
    expect(document.documentElement.style.getPropertyValue("--ice-depth")).toBe("0.000");

    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.getByText("Tray temp")).toBeInTheDocument();
    expect(screen.getByText("16°C")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(50_000);
    });
    expect(screen.getByText("-8°C")).toBeInTheDocument();
    expect(document.documentElement.style.getPropertyValue("--ice-depth")).toBe("1.000");
    expect(document.documentElement.dataset.ice).toBe("cold");
  });

  it("never captures a click and stays off when motion is reduced", () => {
    const { container, unmount } = render(<IceClimate />);
    expect(container.querySelector(".ice-rise")).not.toBeNull();
    unmount();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () => ({
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }),
    });
    const quiet = render(<IceClimate />);
    expect(quiet.container.querySelector(".tray-temp")).toBeNull();
    expect(quiet.container.querySelector(".ice-rise")).toBeNull();
  });
});
