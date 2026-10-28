"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <main id="main">
      <h1>This page could not be loaded.</h1>
      <p>
        <Link href="/">Return to Legacy</Link>
      </p>
    </main>
  );
}
