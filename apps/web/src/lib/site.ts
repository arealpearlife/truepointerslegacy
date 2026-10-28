import { PUBLIC_SITE_URL } from "@truepointers/commerce";

export function publicSiteOrigin(value = process.env.NEXT_PUBLIC_SITE_URL): string {
  const candidate = value?.trim() || PUBLIC_SITE_URL;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:") return PUBLIC_SITE_URL;
    return url.origin;
  } catch {
    return PUBLIC_SITE_URL;
  }
}

export function publicSiteUrl(value = process.env.NEXT_PUBLIC_SITE_URL): URL {
  return new URL(publicSiteOrigin(value));
}
