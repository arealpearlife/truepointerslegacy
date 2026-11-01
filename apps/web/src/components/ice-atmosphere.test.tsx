import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IceAtmosphere, IceGust } from "./ice-atmosphere";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Ice atmosphere", () => {
  it("lays a looping flurry instead of flash self-love copy", () => {
    const { container } = render(<IceAtmosphere />);
    expect(container.querySelector(".ice-flurry")).not.toBeNull();
    expect(container.querySelectorAll(".ice-flurry-field i").length).toBeGreaterThan(10);
    expect(container.textContent).not.toMatch(/FLASH\. SELF LOVE/i);
  });

  it("places a crossing gust where the old beat sat", () => {
    const { container } = render(<IceGust />);
    expect(container.querySelector(".ice-gust")).not.toBeNull();
    expect(container.querySelectorAll(".ice-gust-field i").length).toBeGreaterThan(8);
  });
});
