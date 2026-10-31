export const STORE_DOMAIN = "rcvvv5-tk.myshopify.com";
export const PUBLIC_SITE_HOST = "legacybytp.com";
export const PUBLIC_SITE_URL = "https://www.legacybytp.com";
export const STOREFRONT_API_VERSION = "2026-10";

export const HANDLES = {
  legacy: "true-pointers-legacy-extended-tennis-chain",
  flawless: "true-pointers-flawless-extended-tennis-chain",
} as const;

export const PRODUCT_TITLES = {
  legacy: "True Pointers Legacy Extended Tennis Chain",
  flawless: "True Pointers Flawless Extended Tennis Chain",
} as const;

export const STONE_SIZE = "Stone size";
export const CHAIN_LENGTH = "Chain length";

export const APPROVED_STONE_SIZES = ["3 mm", "4 mm", "5 mm"] as const;
export const APPROVED_CHAIN_LENGTHS = ["40 inches", "44 inches", "48 inches"] as const;

export type Edition = "legacy" | "flawless";
export type StoneSize = (typeof APPROVED_STONE_SIZES)[number];
export type ChainLength = (typeof APPROVED_CHAIN_LENGTHS)[number];

export const MAX_LINE_QUANTITY = 20;

export function editionFromHandle(handle: string): Edition | null {
  if (handle === HANDLES.legacy) return "legacy";
  if (handle === HANDLES.flawless) return "flawless";
  return null;
}

export const CUSTOMER_UNAVAILABLE = "This piece is not available to purchase yet.";
export const CUSTOMER_CONFIGURATION_UNAVAILABLE = "This configuration is not available.";
export const CUSTOMER_SELECT_CONFIGURATION = "Select a stone size and chain length.";
export const CUSTOMER_CHECKOUT_ERROR = "We could not reach checkout. Please try again.";
export const CUSTOMER_CART_ERROR = "Shopify could not update the cart.";
export const CUSTOMER_KIT_UNAVAILABLE = "The three-length kit is not available to add yet.";
