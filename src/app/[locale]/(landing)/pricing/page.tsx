import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getMetadata } from '@/shared/lib/seo';

import { PricingContent, PricingPageContent } from './pricing-content';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'pages.pricing.metadata',
  canonicalUrl: '/pricing',
});

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.pricing');
  const content = t.raw('content') as PricingPageContent;

  return <PricingContent content={content} />;
}
