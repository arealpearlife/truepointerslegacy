import { afterEach, describe, expect, it, vi } from "vitest";
import { releasePlayback, requestMutedPlayback } from "./video-playback";

function fakeVideo() {
  return {
    muted: false,
    pause: vi.fn(),
    play: vi.fn().mockResolvedValue(undefined),
  } as unknown as HTMLVideoElement;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("muted video playback", () => {
  it("mutes and plays without pausing other clips", async () => {
    const first = fakeVideo();
    const second = fakeVideo();
    await requestMutedPlayback(first);
    expect(first.muted).toBe(true);
    expect(first.play).toHaveBeenCalledTimes(1);

    await requestMutedPlayback(second);
    expect(second.muted).toBe(true);
    expect(first.pause).not.toHaveBeenCalled();
    expect(second.play).toHaveBeenCalledTimes(1);

    releasePlayback(second);
    expect(second.pause).toHaveBeenCalled();
  });
});
