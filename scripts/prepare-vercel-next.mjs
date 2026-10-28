import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";

// Vercel is configured with Root Directory "./" and the Next.js preset.
// The real app lives in apps/web. Stage it at the repo root for `next build`.
const root = process.cwd();
const web = path.join(root, "apps/web");

function replace(destination, source) {
  if (!existsSync(source)) {
    throw new Error(`Missing ${source}`);
  }
  if (existsSync(destination)) {
    rmSync(destination, { recursive: true, force: true });
  }
  cpSync(source, destination, { recursive: true });
}

replace(path.join(root, "src"), path.join(web, "src"));
replace(path.join(root, "public"), path.join(web, "public"));
if (existsSync(path.join(web, "next-env.d.ts"))) {
  cpSync(path.join(web, "next-env.d.ts"), path.join(root, "next-env.d.ts"));
}
