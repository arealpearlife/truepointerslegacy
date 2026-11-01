import type { MetadataRoute } from "next";
import { HANDLES } from "@truepointers/commerce";
import { absoluteUrl, publicRoutes } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes = [`/products/${HANDLES.legacy}`, `/products/${HANDLES.flawless}`] as const;
  return [...publicRoutes, ...productRoutes].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" || path.startsWith("/products") ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/the-drop" || path.startsWith("/products") ? 0.9 : 0.5,
  }));
}
