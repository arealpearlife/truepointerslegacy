export function requestMutedPlayback(element: HTMLVideoElement): Promise<void> {
  element.muted = true;
  if (element.preload === "none" && element.readyState === 0) {
    try {
      element.load();
    } catch {
      // jsdom does not implement load.
    }
  }
  return element.play().then(
    () => undefined,
    () => undefined,
  );
}

export function releasePlayback(element: HTMLVideoElement): void {
  try {
    element.pause();
  } catch {
    // jsdom does not implement pause.
  }
}
