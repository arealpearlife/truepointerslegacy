import { HANDLES } from "./store";
import type { CatalogSnapshot, CommerceResult, Product } from "./types";

export type ProductSource = {
  productByHandle(handle: string): Promise<CommerceResult<Product | null>>;
};

export async function loadStoreCatalog(source: ProductSource): Promise<CatalogSnapshot> {
  const [legacy, flawless] = await Promise.all([
    source.productByHandle(HANDLES.legacy),
    source.productByHandle(HANDLES.flawless),
  ]);
  if (!legacy.ok && !flawless.ok) return { state: "unavailable" };
  return {
    state: "live",
    legacy: legacy.ok ? legacy.data : null,
    flawless: flawless.ok ? flawless.data : null,
  };
}
