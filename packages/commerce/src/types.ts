export type Money = {
  amount: string;
  currencyCode: string;
  cents: number;
};

export type ImageAsset = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type VideoAsset = {
  url: string;
  mimeType: string | null;
  previewImage: ImageAsset | null;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: SelectedOption[];
  image: ImageAsset | null;
};

export type ProductOption = {
  name: string;
  values: string[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  options: ProductOption[];
  images: ImageAsset[];
  videos: VideoAsset[];
  variants: Variant[];
};

export type Selection = {
  stoneSize: string | null;
  chainLength: string | null;
};

export type Resolution =
  | { status: "incomplete" }
  | { status: "invalid" }
  | { status: "ambiguous" }
  | { status: "unavailable"; variant: Variant | null }
  | { status: "available"; variant: Variant };

export type CartLine = {
  id: string;
  quantity: number;
  merchandiseId: string;
  productTitle: string;
  productHandle: string;
  selectedOptions: SelectedOption[];
  total: Money;
  image: ImageAsset | null;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: Money;
  lines: CartLine[];
};

export type CommerceFailure = {
  ok: false;
  code: "network" | "rejected" | "invalid_response" | "not_purchasable";
  message: string;
};

export type CommerceSuccess<T> = {
  ok: true;
  data: T;
};

export type CommerceResult<T> = CommerceSuccess<T> | CommerceFailure;

export type CatalogSnapshot =
  { state: "unavailable" } | { state: "live"; legacy: Product | null; flawless: Product | null };

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
};

export type CartLineUpdate = {
  id: string;
  quantity: number;
};
