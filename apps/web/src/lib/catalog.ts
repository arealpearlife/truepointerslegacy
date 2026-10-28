import "server-only";

import { cache } from "react";
import { auditApprovedPrices } from "@truepointers/commerce/approval";
import { loadStoreCatalog, type CatalogSnapshot } from "@truepointers/commerce";
import { getStorefront } from "./shopify";

export const getCatalog = cache(async (): Promise<CatalogSnapshot> => {
  const client = await getStorefront();
  const snapshot = await loadStoreCatalog(client);
  if (snapshot.state === "live") {
    for (const edition of ["legacy", "flawless"] as const) {
      const product = snapshot[edition];
      if (!product) continue;
      const mismatches = auditApprovedPrices(product, edition);
      if (mismatches.length > 0) {
        console.warn(`Approved ${edition} price audit found ${mismatches.length} difference(s).`);
      }
    }
  }
  return snapshot;
});
