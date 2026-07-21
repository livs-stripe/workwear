import Link from "next/link";

const HEADLINE = [
  {
    n: "01",
    title: "NSW Government Contract",
    accent: "Stripe Invoicing + auto-charge",
    problem:
      "19 NSW Health hospitals each pay uniform invoices by hand — someone has to chase every Citibank corporate card.",
    solution:
      "Store each hospital's card once. Every invoice is charged automatically — no human involved.",
    href: "/demo/nsw-gov",
    urgent: true,
  },
  {
    n: "02",
    title: "B2B Invoicing",
    accent: "Enterprise accounts receivable",
    problem:
      "Qantas, airports and construction clients order in bulk, but payment collection is manual and slow.",
    solution:
      "Stripe Invoicing runs the full lifecycle — email + payment link, hosted page, bank transfer or BECS direct debit.",
    href: "/demo/invoicing",
    urgent: false,
  },
  {
    n: "03",
    title: "B2B Portal Checkout",
    accent: "SAP Commerce Cloud — Stripe OPF",
    problem:
      "Corporate buyers ordering through the B2B web portal need to pay at checkout, not just get invoiced.",
    solution:
      "Stripe embeds into SAP Commerce Cloud. Buyers pay by card at checkout; NET-terms clients are invoiced instead.",
    href: "/demo/checkout",
    urgent: false,
  },
];

const SECONDARY = [
  {
    title: "MOTO Terminal",
    description: "Finance staff take card payments over the phone.",
    href: "/demo/moto",
    accent: "Finance",
  },
  {
    title: "Payment Links",
    description: "Send clients a self-serve link to pay bulk orders.",
    href: "/demo/payment-links",
    accent: "Self-Serve",
  },
];

export default function DemoHub() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
          Internal Payments Platform
        </p>
        <h1 className="mt-2 text-4xl font-bold uppercase tracking-[0.02em] text-charcoal">
          Workwear Group — Digital Payments
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-charcoal-light">
          Three ways Workwear Group collects payment — a government contract
          that must be automated, enterprise invoicing at scale, and card
          payments in the B2B web portal — powered end-to-end by Stripe.
        </p>
      </div>

      {/* Three headline demos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {HEADLINE.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col overflow-hidden rounded-xl border border-wwgBorder bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
          >
            <div className="flex items-center justify-between border-b border-wwgBorder bg-wwgSurface px-6 py-3">
              <span className="font-mono text-sm font-bold text-wwgGrey">
                {card.n}
              </span>
              {card.urgent ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white" />
                  Urgent
                </span>
              ) : (
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-wwgGrey">
                  {card.accent}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col px-6 py-5">
              {card.urgent && (
                <span className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-wwgGrey">
                  {card.accent}
                </span>
              )}
              <h2 className="text-2xl font-bold uppercase leading-tight tracking-[0.02em] text-charcoal">
                {card.title}
              </h2>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal-light">
                    The problem
                  </p>
                  <p className="mt-1 leading-relaxed text-charcoal">
                    {card.problem}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-dark">
                    What Stripe does
                  </p>
                  <p className="mt-1 leading-relaxed text-charcoal">
                    {card.solution}
                  </p>
                </div>
              </div>
              <span className="mt-6 inline-flex items-center gap-1 font-semibold uppercase tracking-wide text-brand">
                Open
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Supporting: live event stream */}
      <Link
        href="/demo/events"
        className="group mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-charcoal bg-charcoal px-6 py-6 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-brand" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Operations
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold uppercase tracking-[0.02em]">
            Live Event Stream
          </h2>
          <p className="mt-1 text-white/70">
            See it all happen live — every customer, invoice and payment across
            the three channels as it lands in Stripe.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide text-brand">
          Open stream
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>

      {/* Secondary demos */}
      <div className="mt-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-wwgGrey">
          More tools
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {SECONDARY.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex items-center justify-between rounded-lg border border-wwgBorder bg-white p-5 shadow-sm transition-all hover:border-brand hover:shadow-md"
            >
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-wwgGrey">
                  {card.accent}
                </span>
                <h3 className="mt-1 text-lg font-bold uppercase tracking-[0.02em] text-charcoal">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm text-charcoal-light">
                  {card.description}
                </p>
              </div>
              <span className="ml-4 text-brand transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
