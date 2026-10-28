import { parseMoney } from "../money";
import { STORE_DOMAIN } from "../store";
import type {
  Cart,
  CartLine,
  ImageAsset,
  Money,
  Product,
  ProductOption,
  SelectedOption,
  Variant,
  VideoAsset,
} from "../types";

export function parseProductData(data: unknown): Product | null {
  const record = recordOf(data, "product data");
  return parseProduct(record.product);
}

export function parseCartPayload(
  data: unknown,
  field: "cart" | "cartCreate" | "cartLinesAdd" | "cartLinesUpdate" | "cartLinesRemove",
): Cart | null {
  const record = recordOf(data, "cart data");
  const payload = field === "cart" ? record.cart : recordOf(record[field], field).cart;
  if (field !== "cart") {
    const errors = recordOf(record[field], field).userErrors;
    if (!Array.isArray(errors)) throw new Error("Missing cart user errors.");
    if (errors.length > 0) throw new CartRejectedError();
  }
  if (payload === null) return null;
  return parseCart(payload);
}

export class CartRejectedError extends Error {
  constructor() {
    super("Cart rejected.");
  }
}

export function isTrustedCheckoutUrl(value: string, domain = STORE_DOMAIN): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === domain || url.hostname === "checkout.shopify.com")
    );
  } catch {
    return false;
  }
}

function parseProduct(value: unknown): Product | null {
  if (value === null) return null;
  const record = recordOf(value, "product");
  return {
    id: text(record.id, "product id"),
    handle: text(record.handle, "handle"),
    title: text(record.title, "title"),
    description: typeof record.description === "string" ? record.description : "",
    options: parseOptions(record.options),
    variants: parseVariants(record.variants),
    ...parseMedia(record.media),
  };
}

function parseOptions(value: unknown): ProductOption[] {
  if (!Array.isArray(value)) throw new Error("Missing options.");
  return value.map((option) => {
    const record = recordOf(option, "option");
    if (!Array.isArray(record.values) || !record.values.every((item) => typeof item === "string")) {
      throw new Error("Invalid option values.");
    }
    return { name: text(record.name, "option name"), values: record.values };
  });
}

function parseVariants(value: unknown): Variant[] {
  const nodes = nodesOf(value, "variants");
  return nodes.map((node) => {
    const record = recordOf(node, "variant");
    return {
      id: text(record.id, "variant id"),
      title: text(record.title, "variant title"),
      availableForSale: booleanOf(record.availableForSale, "availableForSale"),
      price: moneyOf(record.price),
      selectedOptions: parseSelectedOptions(record.selectedOptions),
      image: parseImage(record.image),
    };
  });
}

function parseMedia(value: unknown): { images: ImageAsset[]; videos: VideoAsset[] } {
  if (value === undefined) return { images: [], videos: [] };
  const images: ImageAsset[] = [];
  const videos: VideoAsset[] = [];
  for (const node of nodesOf(value, "media")) {
    const record = recordOf(node, "media");
    if (record.mediaContentType === "IMAGE") {
      const image = parseImage(record.image);
      if (image) images.push({ ...image, altText: image.altText ?? optionalText(record.alt) });
    }
    if (record.mediaContentType === "VIDEO" && Array.isArray(record.sources)) {
      const playable = record.sources
        .map((item) => recordOf(item, "video source"))
        .filter((item) => typeof item.url === "string" && item.url.startsWith("https://"));
      const mp4 = playable
        .filter((item) => item.mimeType === "video/mp4")
        .sort((a, b) => (Number(b.height) || 0) - (Number(a.height) || 0));
      const sourceRecord = mp4.find((item) => (Number(item.height) || 0) <= 1080) ?? mp4[0];
      if (!sourceRecord) continue;
      videos.push({
        url: text(sourceRecord.url, "video url"),
        mimeType: optionalText(sourceRecord.mimeType),
        previewImage: parseImage(record.previewImage),
      });
    }
  }
  return { images, videos };
}

function parseCart(value: unknown): Cart {
  const record = recordOf(value, "cart");
  const checkoutUrl = text(record.checkoutUrl, "checkout URL");
  if (!isTrustedCheckoutUrl(checkoutUrl)) throw new Error("Untrusted checkout URL.");
  const id = text(record.id, "cart id");
  if (!id.startsWith("gid://shopify/Cart/")) throw new Error("Invalid cart id.");
  return {
    id,
    checkoutUrl,
    totalQuantity: integerOf(record.totalQuantity, "total quantity"),
    subtotal: moneyOf(recordOf(record.cost, "cost").subtotalAmount),
    lines: nodesOf(record.lines, "lines").map(parseCartLine),
  };
}

function parseCartLine(value: unknown): CartLine {
  const record = recordOf(value, "cart line");
  const merchandise = recordOf(record.merchandise, "merchandise");
  if (merchandise.__typename !== "ProductVariant") throw new Error("Unsupported merchandise.");
  const product = recordOf(merchandise.product, "line product");
  return {
    id: text(record.id, "line id"),
    quantity: integerOf(record.quantity, "line quantity"),
    merchandiseId: text(merchandise.id, "merchandise id"),
    productTitle: text(product.title, "line product title"),
    productHandle: text(product.handle, "line product handle"),
    selectedOptions: parseSelectedOptions(merchandise.selectedOptions),
    total: moneyOf(recordOf(record.cost, "line cost").totalAmount),
    image: parseImage(merchandise.image),
  };
}

function parseSelectedOptions(value: unknown): SelectedOption[] {
  if (!Array.isArray(value)) throw new Error("Missing selected options.");
  return value.map((option) => {
    const record = recordOf(option, "selected option");
    return {
      name: text(record.name, "selected option name"),
      value: text(record.value, "selected option value"),
    };
  });
}

function parseImage(value: unknown): ImageAsset | null {
  if (value === null || value === undefined) return null;
  const record = recordOf(value, "image");
  const url = text(record.url, "image url");
  if (!url.startsWith("https://")) return null;
  return {
    url,
    altText: optionalText(record.altText),
    width: optionalInteger(record.width),
    height: optionalInteger(record.height),
  };
}

function moneyOf(value: unknown): Money {
  const record = recordOf(value, "money");
  return parseMoney(text(record.amount, "amount"), text(record.currencyCode, "currency"));
}

function nodesOf(value: unknown, label: string): unknown[] {
  const record = recordOf(value, label);
  if (!Array.isArray(record.nodes)) throw new Error(`Missing ${label}.`);
  return record.nodes;
}

function recordOf(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Invalid ${label}.`);
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") throw new Error(`Invalid ${label}.`);
  return value;
}

function optionalText(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function booleanOf(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") throw new Error(`Invalid ${label}.`);
  return value;
}

function integerOf(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isInteger(value)) throw new Error(`Invalid ${label}.`);
  return value;
}

function optionalInteger(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  return integerOf(value, "dimension");
}
