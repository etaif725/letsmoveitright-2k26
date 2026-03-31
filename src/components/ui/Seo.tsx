import { Helmet } from "react-helmet-async";
import { COMPANY } from "@/data/company";
import type { PageSeo } from "@/data/seo";

interface SeoProps extends Partial<PageSeo> {
  title: string;
  jsonLd?: Record<string, unknown>;
}

export default function Seo({ title, description, canonical, ogType = "article", jsonLd }: SeoProps) {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content={COMPANY.shortName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
