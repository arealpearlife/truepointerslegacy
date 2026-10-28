"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoAsset } from "@truepointers/commerce";

// Plays muted only while on screen, and never moves for visitors who prefer reduced motion.
export function PreviewVideo({
  video,
  label,
  className,
  controlsWhenStill = false,
}: {
  video: VideoAsset;
  label?: string;
  className?: string;
  controlsWhenStill?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);

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
        element.play().catch(() => undefined);
      } else {
        element.pause();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0.25 },
    );
    observer.observe(element);
    motion.addEventListener("change", sync);
    sync();
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
    };
  }, [video.url]);

  return (
    <video
      ref={ref}
      key={video.url}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      controls={still && controlsWhenStill}
      poster={video.previewImage?.url}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <source src={video.url} type={video.mimeType ?? undefined} />
    </video>
  );
}
