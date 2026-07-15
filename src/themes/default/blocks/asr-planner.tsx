'use client';

import { useMemo, useState } from 'react';
import {
  AudioLines,
  Gauge,
  Languages,
  ListChecks,
  ShieldCheck,
  Users,
  Workflow,
} from 'lucide-react';

import { Section } from '@/shared/types/blocks/landing';

const useCases = [
  'Meeting transcription',
  'Live captions',
  'Contact-center QA',
  'Media archive search',
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function AsrPlanner({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const [monthlyHours, setMonthlyHours] = useState(120);
  const [speakers, setSpeakers] = useState(3);
  const [languages, setLanguages] = useState(2);
  const [useCase, setUseCase] = useState(useCases[0]);
  const [customVocabulary, setCustomVocabulary] = useState(true);
  const [redaction, setRedaction] = useState(false);

  const plan = useMemo(() => {
    const complexity =
      monthlyHours / 600 +
      speakers * 0.08 +
      languages * 0.1 +
      (customVocabulary ? 0.12 : 0) +
      (redaction ? 0.2 : 0);
    const reviewRate = clamp(0.16 + complexity * 0.1, 0.18, 0.46);
    const reviewHours = Math.round(monthlyHours * reviewRate);
    const automationHours = Math.max(monthlyHours - reviewHours, 0);

    const realtime =
      useCase === 'Live captions' || useCase === 'Contact-center QA';
    const diarization = speakers > 1;
    const modelPath =
      languages > 2
        ? 'multilingual ASR with language routing'
        : 'domain-tuned ASR with confidence scoring';
    const latencyTarget = realtime ? 'under 2 seconds' : 'batch throughput';
    const qualityGate =
      speakers > 4 || languages > 3
        ? 'human review for low-confidence segments'
        : 'sample review plus keyword checks';

    return {
      automationHours,
      reviewHours,
      pipeline: [
        realtime ? 'streaming audio capture' : 'file ingest and normalization',
        modelPath,
        diarization ? 'speaker diarization' : 'single-speaker segmentation',
        customVocabulary ? 'custom vocabulary boost' : 'general vocabulary',
        redaction ? 'PII redaction layer' : 'secure transcript export',
      ],
      metrics: [
        { label: 'Latency target', value: latencyTarget },
        { label: 'Quality gate', value: qualityGate },
        { label: 'Monthly review', value: `${reviewHours}h` },
      ],
    };
  }, [customVocabulary, languages, monthlyHours, redaction, speakers, useCase]);

  return (
    <section
      id={section.id}
      className={`border-y bg-secondary/35 py-16 md:py-24 ${className || ''}`}
    >
      <div className="container">
        <div className="mx-auto max-w-4xl text-center text-balance">
          <p className="text-primary text-sm font-medium">{section.label}</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            {section.title}
          </h2>
          <p className="text-muted-foreground mt-4">{section.description}</p>
        </div>

        <div className="bg-background mt-12 grid overflow-hidden rounded-lg border md:grid-cols-[1fr_1.1fr]">
          <div className="space-y-8 border-b p-5 md:border-r md:border-b-0 md:p-8">
            <label className="block space-y-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <AudioLines className="size-4 text-primary" />
                Audio hours per month
              </span>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={monthlyHours}
                onChange={(event) =>
                  setMonthlyHours(Number(event.currentTarget.value))
                }
                className="accent-primary w-full"
              />
              <span className="text-muted-foreground block text-sm">
                {monthlyHours.toLocaleString()} hours
              </span>
            </label>

            <label className="block space-y-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Users className="size-4 text-primary" />
                Speakers per file
              </span>
              <input
                type="range"
                min="1"
                max="10"
                value={speakers}
                onChange={(event) =>
                  setSpeakers(Number(event.currentTarget.value))
                }
                className="accent-primary w-full"
              />
              <span className="text-muted-foreground block text-sm">
                {speakers} speaker{speakers === 1 ? '' : 's'}
              </span>
            </label>

            <label className="block space-y-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Languages className="size-4 text-primary" />
                Languages or dialects
              </span>
              <input
                type="range"
                min="1"
                max="6"
                value={languages}
                onChange={(event) =>
                  setLanguages(Number(event.currentTarget.value))
                }
                className="accent-primary w-full"
              />
              <span className="text-muted-foreground block text-sm">
                {languages} language{languages === 1 ? '' : 's'}
              </span>
            </label>

            <label className="block space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Workflow className="size-4 text-primary" />
                Primary workflow
              </span>
              <select
                value={useCase}
                onChange={(event) => setUseCase(event.currentTarget.value)}
                className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2"
              >
                {useCases.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-md border p-3 text-sm">
                <input
                  type="checkbox"
                  checked={customVocabulary}
                  onChange={(event) =>
                    setCustomVocabulary(event.currentTarget.checked)
                  }
                  className="accent-primary size-4"
                />
                Custom vocabulary
              </label>
              <label className="flex items-center gap-3 rounded-md border p-3 text-sm">
                <input
                  type="checkbox"
                  checked={redaction}
                  onChange={(event) =>
                    setRedaction(event.currentTarget.checked)
                  }
                  className="accent-primary size-4"
                />
                PII redaction
              </label>
            </div>
          </div>

          <div className="p-5 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Gauge className="size-4 text-primary" />
                  Automated transcript volume
                </div>
                <p className="mt-3 text-3xl font-semibold">
                  {plan.automationHours.toLocaleString()}h
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  estimated monthly audio after review allocation
                </p>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="size-4 text-primary" />
                  Review allocation
                </div>
                <p className="mt-3 text-3xl font-semibold">
                  {plan.reviewHours.toLocaleString()}h
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  reserved for confidence, speaker, and compliance checks
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-md border">
              <div className="border-b p-4">
                <div className="flex items-center gap-2 font-medium">
                  <ListChecks className="size-4 text-primary" />
                  Recommended ASR pipeline
                </div>
              </div>
              <ol className="divide-y">
                {plan.pipeline.map((item, index) => (
                  <li
                    key={item}
                    className="grid grid-cols-[2.25rem_1fr] items-center gap-3 p-4 text-sm"
                  >
                    <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full font-medium">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 grid gap-3">
              {plan.metrics.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-1 rounded-md border p-4 text-sm sm:grid-cols-[10rem_1fr]"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
