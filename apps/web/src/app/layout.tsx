import type { Metadata, Viewport } from "next";
import { Anton, Graduate, Lato, Tenor_Sans } from "next/font/google";
import { cssVariables } from "@truepointers/tokens";
import { AnnouncementBar } from "@/components/announcement-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCart } from "@/lib/cart";
import { PUBLIC_INDEXING, publicSiteUrl } from "@/lib/site";
import { stripCursorRefScript } from "@/lib/strip-cursor-refs";
import "./globals.css";

const poster = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poster",
  display: "swap",
});
const varsity = Graduate({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-varsity",
  display: "swap",
});
const display = Tenor_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});
const body = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: publicSiteUrl(),
  title: { default: "True Pointers Legacy", template: "%s · True Pointers" },
  description:
    "True Pointers presents Legacy, an extended tennis chain. Flawless Upgrade for the elevated version.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "True Pointers Legacy",
  },
  robots: PUBLIC_INDEXING,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#B51232",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cart = await getCart();
  return (
    <html lang="en">
      <head>
        <style>{cssVariables}</style>
      </head>
      <body
        className={`${poster.variable} ${varsity.variable} ${display.variable} ${body.variable}`}
      >
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <AnnouncementBar />
        <SiteHeader cartCount={cart?.totalQuantity ?? 0} />
        {children}
        <SiteFooter />
        {process.env.NODE_ENV === "development" ? (
          <script dangerouslySetInnerHTML={{ __html: stripCursorRefScript }} />
        ) : null}
      </body>
    </html>
  );
}
