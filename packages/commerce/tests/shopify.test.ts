import { describe, expect, it, vi } from "vitest";
import { CUSTOMER_CART_ERROR } from "../src/store";
import { createStorefrontClient } from "../src/shopify/client";
import { isTrustedCheckoutUrl } from "../src/shopify/parse";

const productBody = {
  data: {
    product: {
      id: "gid://shopify/Product/1",
      handle: "true-pointers-legacy-extended-tennis-chain",
      title: "True Pointers Legacy Extended Tennis Chain",
      description: "Stone material: cubic zirconia.",
      options: [
        { name: "Stone size", values: ["3 mm"] },
        { name: "Chain length", values: ["40 inches"] },
      ],
      media: { nodes: [] },
      variants: {
        nodes: [
          {
            id: "gid://shopify/ProductVariant/1100",
            title: "3 mm / 40 inches",
            availableForSale: true,
            price: { amount: "329.00", currencyCode: "USD" },
            selectedOptions: [
              { name: "Stone size", value: "3 mm" },
              { name: "Chain length", value: "40 inches" },
            ],
            image: null,
          },
        ],
      },
    },
  },
};

const cart = {
  id: "gid://shopify/Cart/abc?key=secret",
  checkoutUrl: "https://rcvvv5-tk.myshopify.com/cart/c/abc?key=secret",
  totalQuantity: 1,
  cost: { subtotalAmount: { amount: "329.00", currencyCode: "USD" } },
  lines: {
    nodes: [
      {
        id: "gid://shopify/CartLine/1",
        quantity: 1,
        cost: { totalAmount: { amount: "329.00", currencyCode: "USD" } },
        merchandise: {
          __typename: "ProductVariant",
          id: "gid://shopify/ProductVariant/1100",
          title: "3 mm / 40 inches",
          availableForSale: true,
          price: { amount: "329.00", currencyCode: "USD" },
          selectedOptions: [
            { name: "Stone size", value: "3 mm" },
            { name: "Chain length", value: "40 inches" },
          ],
          image: null,
          product: {
            title: "True Pointers Legacy Extended Tennis Chain",
            handle: "true-pointers-legacy-extended-tennis-chain",
          },
        },
      },
    ],
  },
};

function requestHeaders(fetchImpl: { mock: { calls: unknown[][] } }): Headers {
  const init = fetchImpl.mock.calls[0]?.[1] as RequestInit | undefined;
  return new Headers(init?.headers);
}

describe("Shopify Storefront client", () => {
  it("reads a product without putting a token on a tokenless request", async () => {
    const fetchImpl = vi.fn(async () => Response.json(productBody));
    const client = createStorefrontClient({
      domain: "rcvvv5-tk.myshopify.com",
      fetchImpl: fetchImpl as typeof fetch,
    });
    const result = await client.productByHandle("true-pointers-legacy-extended-tennis-chain");
    expect(result.ok).toBe(true);
    if (result.ok && result.data) expect(result.data.variants[0]?.price.amount).toBe("329.00");
    const headers = requestHeaders(fetchImpl);
    expect(headers.get("X-Shopify-Storefront-Access-Token")).toBeNull();
    expect(headers.get("Shopify-Storefront-Private-Token")).toBeNull();
  });

  it("picks a browser-playable MP4 source for product videos", async () => {
    const withVideo = structuredClone(productBody);
    withVideo.data.product.media = {
      nodes: [
        {
          mediaContentType: "VIDEO",
          alt: null,
          sources: [
            { url: "https://cdn.shopify.com/v/stream.m3u8", mimeType: "application/x-mpegURL" },
            { url: "https://cdn.shopify.com/v/480.mp4", mimeType: "video/mp4", height: 480 },
            { url: "https://cdn.shopify.com/v/1080.mp4", mimeType: "video/mp4", height: 1080 },
            { url: "https://cdn.shopify.com/v/2160.mp4", mimeType: "video/mp4", height: 2160 },
          ],
          previewImage: null,
        },
      ],
    } as never;
    const fetchImpl = vi.fn(async () => Response.json(withVideo));
    const client = createStorefrontClient({
      domain: "rcvvv5-tk.myshopify.com",
      fetchImpl: fetchImpl as typeof fetch,
    });
    const result = await client.productByHandle("true-pointers-legacy-extended-tennis-chain");
    expect(result.ok && result.data?.videos).toEqual([
      { url: "https://cdn.shopify.com/v/1080.mp4", mimeType: "video/mp4", previewImage: null },
    ]);
  });

  it("sends the private token only as a server header", async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({ data: { cartCreate: { cart, userErrors: [] } } }),
    );
    const client = createStorefrontClient({
      domain: "rcvvv5-tk.myshopify.com",
      privateAccessToken: "private-token",
      publicAccessToken: "public-token",
      buyerIp: "203.0.113.8",
      fetchImpl: fetchImpl as typeof fetch,
    });
    const result = await client.createCart("gid://shopify/ProductVariant/1100", 1);
    expect(result.ok).toBe(true);
    const headers = requestHeaders(fetchImpl);
    expect(headers.get("Shopify-Storefront-Private-Token")).toBe("private-token");
    expect(headers.get("Shopify-Storefront-Buyer-IP")).toBe("203.0.113.8");
    expect(headers.get("X-Shopify-Storefront-Access-Token")).toBeNull();
  });

  it("hides raw cart rejection details", async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({
        data: { cartCreate: { cart: null, userErrors: [{ message: "secret cart key abc" }] } },
      }),
    );
    const client = createStorefrontClient({
      domain: "rcvvv5-tk.myshopify.com",
      fetchImpl: fetchImpl as typeof fetch,
    });
    const result = await client.createCart("gid://shopify/ProductVariant/1100", 1);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe(CUSTOMER_CART_ERROR);
      expect(result.message).not.toContain("secret");
    }
  });

  it("accepts only this store's Shopify checkout URL", () => {
    expect(isTrustedCheckoutUrl("https://rcvvv5-tk.myshopify.com/cart/c/abc?key=secret")).toBe(
      true,
    );
    expect(isTrustedCheckoutUrl("https://checkout.shopify.com/pay/abc")).toBe(true);
    expect(isTrustedCheckoutUrl("http://rcvvv5-tk.myshopify.com/cart/c/abc")).toBe(false);
    expect(isTrustedCheckoutUrl("https://evil.example/cart")).toBe(false);
  });
});
