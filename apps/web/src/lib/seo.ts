import { discovery, SEARCH_KEYWORDS } from "@truepointers/commerce";
import { publicSiteOrigin } from "./site";

export const FACEBOOK_PAGE_URL = "https://www.facebook.com/profile.php?id=61596015515329";

export const publicRoutes = [
  "/",
  "/the-drop",
  "/flawless",
  "/support",
  "/policies/shipping",
  "/policies/returns",
  "/policies/care",
  "/policies/warranty",
  "/policies/privacy",
  "/policies/terms",
] as const;

export function absoluteUrl(path = "/"): string {
  const origin = publicSiteOrigin();
  if (path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata(input: { title: string; description: string; path: string }) {
  const url = absoluteUrl(input.path);
  return {
    title: input.title,
    description: input.description,
    keywords: [...SEARCH_KEYWORDS],
    alternates: { canonical: input.path },
    openGraph: {
      type: "website" as const,
      url,
      siteName: discovery.siteName,
      title: input.title,
      description: input.description,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: input.title,
      description: input.description,
    },
  };
}

export function organizationGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "JewelryStore"],
        "@id": `${absoluteUrl()}/#house`,
        name: discovery.siteName,
        alternateName: [discovery.brandShort, "legacybytp.com"],
        url: absoluteUrl(),
        description: discovery.homeDescription,
        sameAs: [FACEBOOK_PAGE_URL],
        areaServed: "US",
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl()}/#site`,
        name: discovery.brandShort,
        alternateName: [discovery.siteName, "legacybytp.com"],
        url: absoluteUrl(),
        description: discovery.homeDescription,
        publisher: { "@id": `${absoluteUrl()}/#house` },
        inLanguage: "en-US",
      },
    ],
  };
}

export function breadcrumbGraph(crumbs: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
