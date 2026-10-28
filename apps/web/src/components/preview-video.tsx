"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoAsset } from "@truepointers/commerce";
import { releasePlayback, requestMutedPlayback } from "@/lib/video-playback";

// Loads and plays muted only while on screen. Grid clips stay at preload=none so they
// do not compete. Reduced motion keeps the clip still.
export function PreviewVideo({
  video,
  label,
  className,
  eager = false,
  controls = false,
  controlsWhenStill = false,
}: {
  video: VideoAsset;
  label?: string;
  className?: string;
  eager?: boolean;
  controls?: boolean;
  controlsWhenStill?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.muted = true;
    if (typeof window.matchMedia !== "function" || typeof IntersectionObserver === "undefined") {
      return;
    }
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      setStill(motion.matches);
      if (visible && !motion.matches) {
        void requestMutedPlayback(element);
      } else {
        releasePlayback(element);
      }
    };
    const onReady = () => {
      setReady(true);
      sync();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        sync();
      },
      { threshold: eager ? 0.05 : 0.45 },
    );
    observer.observe(element);
    motion.addEventListener("change", sync);
    element.addEventListener("loadeddata", onReady);
    element.addEventListener("canplay", onReady);
    sync();
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
      element.removeEventListener("loadeddata", onReady);
      element.removeEventListener("canplay", onReady);
      releasePlayback(element);
    };
  }, [video.url, eager]);

  return (
    <video
      ref={ref}
      key={video.url}
      className={className}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      controls={controls || (still && controlsWhenStill)}
      poster={video.previewImage?.url}
      data-ready={ready ? "true" : "false"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <source src={video.url} type={video.mimeType ?? undefined} />
    </video>
  );
}
