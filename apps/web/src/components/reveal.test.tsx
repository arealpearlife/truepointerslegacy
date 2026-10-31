import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Reveal } from "./reveal";

describe("Reveal", () => {
  it("shows children immediately when motion is reduced", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: query.includes("reduce"),
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }),
    });
    const { container } = render(
      <Reveal>
        <p>The ice</p>
      </Reveal>,
    );
    expect(screen.getByText("The ice")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("is-in");
  });
});
