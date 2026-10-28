import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { legacyChainVideo } from "@/lib/local-media";
import { PreviewVideo } from "./preview-video";

let reportVisibility: (visible: boolean) => void = () => undefined;

function installBrowser(reducedMotion: boolean) {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
        reportVisibility = (visible) => callback([{ isIntersecting: visible }]);
      }
      observe() {}
      disconnect() {}
    },
  );
  window.matchMedia = vi.fn().mockReturnValue({
    matches: reducedMotion,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  return { play, pause };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("PreviewVideo", () => {
  it("plays muted only while it is on screen", () => {
    const { play, pause } = installBrowser(false);
    const { container } = render(<PreviewVideo video={legacyChainVideo} />);
    const video = container.querySelector("video")!;
    expect(video.muted).toBe(true);
    expect(video.autoplay).toBe(false);
    expect(video).toHaveAttribute("preload", "none");
    expect(play).not.toHaveBeenCalled();

    act(() => reportVisibility(true));
    expect(play).toHaveBeenCalledTimes(1);
    act(() => reportVisibility(false));
    expect(pause).toHaveBeenCalled();
  });

  it("preloads the hero clip so the first frame can appear", () => {
    installBrowser(false);
    const { container } = render(<PreviewVideo video={legacyChainVideo} eager />);
    expect(container.querySelector("video")).toHaveAttribute("preload", "auto");
  });

  it("stays still with controls when the visitor prefers reduced motion", () => {
    const { play } = installBrowser(true);
    const { container } = render(<PreviewVideo video={legacyChainVideo} controlsWhenStill />);
    act(() => reportVisibility(true));
    expect(play).not.toHaveBeenCalled();
    expect(container.querySelector("video")).toHaveAttribute("controls");
  });
});
