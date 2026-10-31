import { notFound } from "next/navigation";
import { policyBySlug, storePolicies } from "@truepointers/commerce";

export function generateStaticParams() {
  return Object.keys(storePolicies).map((policy) => ({ policy }));
}

export async function generateMetadata({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  const page = policyBySlug(policy);
  return { title: page?.title ?? "Policy" };
}

export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  const page = policyBySlug(policy);
  if (!page) notFound();
  return (
    <main id="main" className="policy">
      <h1>{page.title}</h1>
      {page.sections.map((section) => (
        <section key={section.heading ?? section.paragraphs[0]}>
          {section.heading ? <h2>{section.heading}</h2> : null}
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </main>
  );
}
