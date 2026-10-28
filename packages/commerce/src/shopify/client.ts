import { CUSTOMER_CART_ERROR, CUSTOMER_CHECKOUT_ERROR, STOREFRONT_API_VERSION } from "../store";
import type { Cart, CartLineInput, CartLineUpdate, CommerceResult, Product } from "../types";
import {
  CartRejectedError,
  isTrustedCheckoutUrl,
  parseCartPayload,
  parseProductData,
} from "./parse";

export { isTrustedCheckoutUrl };

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 50) {
    nodes {
      id
      quantity
      cost { totalAmount { amount currencyCode } }
      merchandise {
        __typename
        ... on ProductVariant {
          id
          title
          availableForSale
          price { amount currencyCode }
          selectedOptions { name value }
          image { url altText width height }
          product { title handle }
        }
      }
    }
  }
`;

const PRODUCT_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      options { name values }
      media(first: 12) {
        nodes {
          mediaContentType
          alt
          ... on MediaImage { image { url altText width height } }
          ... on Video {
            sources { url mimeType }
            previewImage { url altText width height }
          }
        }
      }
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
          price { amount currencyCode }
          selectedOptions { name value }
          image { url altText width height }
        }
      }
    }
  }
`;

export type StorefrontConfig = {
  domain: string;
  apiVersion?: string;
  publicAccessToken?: string;
  privateAccessToken?: string;
  buyerIp?: string;
  fetchImpl?: typeof fetch;
};

export type StorefrontClient = {
  productByHandle(handle: string): Promise<CommerceResult<Product | null>>;
  getCart(cartId: string): Promise<CommerceResult<Cart | null>>;
  createCart(variantId: string, quantity: number): Promise<CommerceResult<Cart>>;
  addLines(cartId: string, lines: CartLineInput[]): Promise<CommerceResult<Cart>>;
  updateLines(cartId: string, lines: CartLineUpdate[]): Promise<CommerceResult<Cart>>;
  removeLines(cartId: string, lineIds: string[]): Promise<CommerceResult<Cart>>;
};

export function createStorefrontClient(config: StorefrontConfig): StorefrontClient {
  const domain = config.domain.trim().toLowerCase();
  const apiVersion = config.apiVersion ?? STOREFRONT_API_VERSION;
  const fetchImpl = config.fetchImpl ?? fetch;
  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  async function request<T>(
    query: string,
    variables: Record<string, unknown>,
    parse: (data: unknown) => T,
  ): Promise<CommerceResult<T>> {
    if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain) || !/^\d{4}-\d{2}$/.test(apiVersion)) {
      return failure("rejected");
    }
    let response: Response;
    try {
      response = await fetchImpl(endpoint, {
        method: "POST",
        headers: headersFor(config),
        body: JSON.stringify({ query, variables }),
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
    } catch {
      return failure("network");
    }
    try {
      if (!response.ok) return failure("network");
      const body: unknown = await response.json();
      if (!isRecord(body) || (Array.isArray(body.errors) && body.errors.length > 0)) {
        return failure("rejected");
      }
      return { ok: true, data: parse(body.data) };
    } catch (error) {
      if (error instanceof CartRejectedError) return failure("rejected", CUSTOMER_CART_ERROR);
      return failure("invalid_response");
    }
  }

  return {
    productByHandle(handle) {
      return request(PRODUCT_QUERY, { handle }, parseProductData);
    },
    getCart(cartId) {
      return request(
        `query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`,
        { id: cartId },
        (data) => parseCartPayload(data, "cart"),
      );
    },
    createCart(variantId, quantity) {
      return cartMutation(
        request,
        "mutation CartCreate($input: CartInput!) { cartCreate(input: $input) { cart { " +
          CART_FIELDS +
          " } userErrors { field message } } }",
        { input: { lines: [{ merchandiseId: variantId, quantity }] } },
        "cartCreate",
      );
    },
    addLines(cartId, lines) {
      return cartMutation(
        request,
        `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { field message } } }`,
        { cartId, lines },
        "cartLinesAdd",
      );
    },
    updateLines(cartId, lines) {
      return cartMutation(
        request,
        `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { field message } } }`,
        { cartId, lines },
        "cartLinesUpdate",
      );
    },
    removeLines(cartId, lineIds) {
      return cartMutation(
        request,
        `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { field message } } }`,
        { cartId, lineIds },
        "cartLinesRemove",
      );
    },
  };

  function failure(
    code: "network" | "rejected" | "invalid_response",
    message = CUSTOMER_CHECKOUT_ERROR,
  ): CommerceResult<never> {
    return { ok: false, code, message };
  }
}

function headersFor(config: StorefrontConfig): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (config.privateAccessToken) {
    headers["Shopify-Storefront-Private-Token"] = config.privateAccessToken;
    if (config.buyerIp) headers["Shopify-Storefront-Buyer-IP"] = config.buyerIp;
    return headers;
  }
  if (config.publicAccessToken) {
    headers["X-Shopify-Storefront-Access-Token"] = config.publicAccessToken;
  }
  return headers;
}

async function cartMutation(
  request: <T>(
    query: string,
    variables: Record<string, unknown>,
    parse: (data: unknown) => T,
  ) => Promise<CommerceResult<T>>,
  query: string,
  variables: Record<string, unknown>,
  field: "cartCreate" | "cartLinesAdd" | "cartLinesUpdate" | "cartLinesRemove",
): Promise<CommerceResult<Cart>> {
  const result = await request(query, variables, (data) => parseCartPayload(data, field));
  if (!result.ok) return result;
  if (!result.data) return { ok: false, code: "invalid_response", message: CUSTOMER_CART_ERROR };
  return { ok: true, data: result.data };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
