import React from "react";
import { Metadata } from "next";
import { getPublishedContent } from "@/lib/content-service";
import { ClientApp } from "@/components/ClientApp";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedContent();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://uic.studio";
  return {
    metadataBase: new URL(baseUrl),
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      images: [
        {
          url: content.seo.ogImage || "/images/nfccard.webp",
          width: 1200,
          height: 630,
          alt: "UIC Studio Custom Aerospace NFC Cards & Digital Flagships",
        },
      ],
      type: "website",
      siteName: content.brand.wordmark || "UIC Studio",
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo.title,
      description: content.seo.description,
      images: [content.seo.ogImage || "/images/nfccard.webp"],
    },
  };
}

export default async function HomePage() {
  const initialContent = await getPublishedContent();

  return <ClientApp initialContent={initialContent} />;
}
