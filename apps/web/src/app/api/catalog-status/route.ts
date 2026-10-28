import { getCatalog } from "@/lib/catalog";

export async function GET() {
  const catalog = await getCatalog();
  if (catalog.state !== "live") {
    return Response.json({ state: "unavailable", legacy: false, flawless: false });
  }
  return Response.json({
    state: "live",
    legacy: catalog.legacy !== null,
    flawless: catalog.flawless !== null,
  });
}
