import Image from "next/image";
import { REPRESENTATIVE_CAPTION, type DisplayMedia } from "@/lib/local-media";
import { PreviewVideo } from "./preview-video";

export function MediaFill({
  media,
  label,
  sizes,
  priority = false,
}: {
  media: DisplayMedia;
  label: string;
  sizes: string;
  priority?: boolean;
}) {
  if (media.kind === "image") {
    return (
      <Image
        src={media.asset.url}
        alt={media.asset.altText ?? label}
        fill
        priority={priority}
        sizes={sizes}
      />
    );
  }
  return (
    <>
      <PreviewVideo
        video={media.asset}
        label={`${label} video`}
        eager={priority}
        controlsWhenStill
      />
      {media.representative ? <span className="media-note">{REPRESENTATIVE_CAPTION}</span> : null}
    </>
  );
}
