import { notFound } from "next/navigation";

const policies = {
  shipping: "Shipping",
  returns: "Returns and refunds",
  privacy: "Privacy",
  terms: "Terms",
  warranty: "Warranty",
  care: "Care",
} as const;

export function generateStaticParams() {
  return Object.keys(policies).map((policy) => ({ policy }));
}

export async function generateMetadata({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  const title = policies[policy as keyof typeof policies];
  return { title: title ?? "Policy" };
}

export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  const title = policies[policy as keyof typeof policies];
  if (!title) notFound();
  return (
    <main id="main" className="policy">
      <h1>{title}</h1>
      <p>
        This policy has not been published yet. True Pointers will post the approved policy before
        orders open.
      </p>
    </main>
  );
}
