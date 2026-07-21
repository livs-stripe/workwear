import type { ReactNode } from "react";

/**
 * Executive-friendly narrative block shown at the top of each demo:
 * "The problem" + "What Stripe does", with an optional urgent banner.
 */
export default function DemoIntro({
  eyebrow,
  title,
  problem,
  solution,
  urgent,
  meta,
}: {
  eyebrow: string;
  title: string;
  problem: ReactNode;
  solution: ReactNode;
  urgent?: boolean;
  meta?: ReactNode;
}) {
  return (
    <section className="mb-8 overflow-hidden rounded-xl border border-wwgBorder bg-white shadow-sm">
      {urgent && (
        <div className="flex items-center gap-2 bg-brand px-6 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white" />
          Urgent — Priority contract
        </div>
      )}
      <div className="px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-3xl font-bold uppercase tracking-[0.02em] text-charcoal">
          {title}
        </h1>
        {meta && <div className="mt-3">{meta}</div>}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-wwgBorder bg-wwgSurface px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-charcoal-light">
              The problem
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-charcoal">
              {problem}
            </p>
          </div>
          <div className="rounded-lg border border-brand/30 bg-brand-light px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-dark">
              What Stripe does
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-charcoal">
              {solution}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
