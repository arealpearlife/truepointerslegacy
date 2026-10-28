import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);

afterEach(() => {
  cleanup();
});
