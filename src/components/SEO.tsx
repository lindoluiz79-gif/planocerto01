// Componente para melhorar SEO com Schema.org e meta tags

export type SEOProps = {
  title: string;
  description: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
  url?: string;
  schema?: object;
};

export function generateSEOTags({
  title,
  description,
  type = 'website',
  image = '/icon-512.png',
  url,
}: SEOProps) {
  const fullTitle = `${title} — PlanoCerto`;
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const fullImage = image.startsWith('http') ? image : `https://planocerto.com.br${image}`;

  return [
    // Basic Meta Tags
    { title: fullTitle },
    { name: 'description', content: description },
    
    // Open Graph
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: fullUrl },
    { property: 'og:image', content: fullImage },
    { property: 'og:site_name', content: 'PlanoCerto' },
    { property: 'og:locale', content: 'pt_BR' },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: fullImage },
    
    // Additional
    { name: 'robots', content: 'index, follow' },
    { name: 'author', content: 'PlanoCerto' },
    { name: 'keywords', content: 'plano de saúde, MEI, autônomo, saúde, comparação, preço' },
  ];
}

// Schema.org para planos de saúde
export function generatePlanSchema(plan: {
  id: string;
  operadora: string;
  nome: string;
  precoMensal: number;
  rating: number;
  reviewCount: number;
  coberturas: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${plan.operadora} - ${plan.nome}`,
    description: `Plano de saúde ${plan.nome} da ${plan.operadora}. ${plan.coberturas.join(', ')}.`,
    brand: {
      '@type': 'Brand',
      name: plan.operadora,
    },
    offers: {
      '@type': 'Offer',
      price: plan.precoMensal.toFixed(2),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: plan.rating.toFixed(1),
      reviewCount: plan.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    url: `https://planocerto.com.br/plano/${plan.id}`,
  };
}

// Schema.org para organização
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PlanoCerto',
    description: 'Compare planos de saúde para MEI e autônomos brasileiros',
    url: 'https://planocerto.com.br',
    logo: 'https://planocerto.com.br/icon-512.png',
    sameAs: [
      // Adicionar redes sociais quando tiver
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'Portuguese',
    },
  };
}

// Schema.org para breadcrumbs
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://planocerto.com.br${item.url}`,
    })),
  };
}

// Schema.org para FAQ
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Componente para injetar Schema.org
export function SchemaOrg({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
