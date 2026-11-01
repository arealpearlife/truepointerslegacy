import type { Metadata } from "next";
import Link from "next/link";
import { HANDLES, discovery, marketing, searchTopics } from "@truepointers/commerce";
import { DesireBeat } from "@/components/desire-beat";
import { FitGuide } from "@/components/fit-guide";
import { breadcrumbGraph, pageMetadata } from "@/lib/seo";

const chainHref = `/products/${HANDLES.legacy}`;

export const metadata: Metadata = pageMetadata({
  title: discovery.dropTitle,
  description: discovery.dropDescription,
  path: "/the-drop",
});

export default function TheDropPage() {
  return (
    <main id="main" className="drop">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbGraph([
              { name: discovery.siteName, path: "/" },
              { name: marketing.navDrop, path: "/the-drop" },
            ]),
          ),
        }}
      />
      <p className="eyebrow">{discovery.dropEyebrow}</p>
      <h1 className="poster">{discovery.dropHeading}</h1>
      <p className="hero-line ice">{discovery.dropLede}</p>
      <p>{discovery.dropStory}</p>
      <div className="actions">
        <Link className="button ice" href={chainHref}>
          {marketing.shopLegacy}
        </Link>
        <Link className="button outline-ink" href="/flawless">
          {marketing.flawlessUpgrade}
        </Link>
      </div>

      <ul className="drop-topics">
        {searchTopics.map((topic) => (
          <li key={topic.id}>
            <h2>{topic.heading}</h2>
            <p>{topic.body}</p>
          </li>
        ))}
      </ul>

      <p className="drop-compare">{discovery.comparison}</p>
      <DesireBeat line={marketing.desireFit} />
      <FitGuide selected={null} />
    </main>
  );
}
