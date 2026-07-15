import { ArrowRight, AudioLines, Building2, Check } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  unit: string;
  note: string;
  featuresTitle: string;
  features: string[];
  button: {
    title: string;
    url: string;
  };
  featured?: boolean;
}

interface PricingFact {
  label: string;
  value: string;
}

export interface PricingPageContent {
  eyebrow: string;
  title: string;
  description: string;
  plans: PricingPlan[];
  factsTitle: string;
  facts: PricingFact[];
  footnote: string;
}

const planIcons = [AudioLines, Building2];

export function PricingContent({ content }: { content: PricingPageContent }) {
  return (
    <main className="min-h-screen pt-28 pb-20 md:pt-36 md:pb-28">
      <section className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-primary mb-4 text-sm font-semibold uppercase">
            {content.eyebrow}
          </p>
          <h1 className="text-foreground text-4xl font-bold text-pretty md:text-5xl">
            {content.title}
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-7 md:text-lg">
            {content.description}
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
          {content.plans.map((plan, index) => {
            const PlanIcon = planIcons[index] || AudioLines;

            return (
              <article
                key={plan.name}
                className={`flex min-h-[500px] flex-col rounded-lg border p-7 shadow-sm md:p-8 ${
                  plan.featured
                    ? 'border-primary bg-card ring-primary/15 ring-4'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{plan.name}</h2>
                    <p className="text-muted-foreground mt-2 min-h-12 text-sm leading-6">
                      {plan.description}
                    </p>
                  </div>
                  <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
                    <PlanIcon className="size-5" aria-hidden="true" />
                  </div>
                </div>

                <div className="mt-8 flex min-h-20 items-end gap-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground mb-1 text-sm">
                    {plan.unit}
                  </span>
                </div>
                <p className="text-muted-foreground mt-2 min-h-10 text-sm">
                  {plan.note}
                </p>

                <div className="border-border mt-7 border-t pt-7">
                  <h3 className="text-sm font-semibold">
                    {plan.featuresTitle}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-3 text-sm leading-6"
                      >
                        <Check
                          className="text-primary mt-1 size-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  asChild
                  variant={plan.featured ? 'default' : 'outline'}
                  className="mt-auto w-full"
                >
                  <Link href={plan.button.url}>
                    {plan.button.title}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-border mt-20 border-y bg-[color-mix(in_oklab,var(--color-muted)_45%,transparent)] py-16">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-semibold md:text-3xl">
              {content.factsTitle}
            </h2>
            <dl className="mt-8 grid gap-x-10 gap-y-0 md:grid-cols-2">
              {content.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="border-border flex min-h-20 items-center justify-between gap-6 border-b py-4"
                >
                  <dt className="text-muted-foreground text-sm">
                    {fact.label}
                  </dt>
                  <dd className="max-w-64 text-right text-sm font-medium">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-muted-foreground mt-8 max-w-3xl text-sm leading-6">
              {content.footnote}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
