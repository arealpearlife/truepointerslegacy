import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { createStorefrontClient, type StorefrontClient } from "@truepointers/commerce/shopify";
import { STORE_DOMAIN, STOREFRONT_API_VERSION } from "@truepointers/commerce";

export const getStorefront = cache(async (): Promise<StorefrontClient> => {
  const headerList = await headers();
  return createStorefrontClient({
    domain: present(process.env.SHOPIFY_STORE_DOMAIN) ?? STORE_DOMAIN,
    apiVersion: present(process.env.SHOPIFY_STOREFRONT_API_VERSION) ?? STOREFRONT_API_VERSION,
    privateAccessToken: present(process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN),
    publicAccessToken: present(process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN),
    buyerIp: buyerIpFrom(headerList),
  });
});

function present(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function buyerIpFrom(headerList: Headers): string | undefined {
  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  const candidate = forwarded || headerList.get("x-real-ip")?.trim();
  if (!candidate || !/^[\da-fA-F:.]+$/.test(candidate)) return undefined;
  return candidate;
}
