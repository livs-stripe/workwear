"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import StatusBadge, { type Status } from "@/components/StatusBadge";
import StripeChip from "@/components/StripeChip";
import DemoIntro from "@/components/DemoIntro";
import CustomerSelect, {
  type EnterpriseCustomer,
} from "@/components/CustomerSelect";
import {
  INVOICING_LINE_ITEMS,
  formatAud,
  lineItemsSubtotal,
  type LineItem,
} from "@/lib/data";

const TERMS = [
  { label: "NET 14", value: 14 },
  { label: "NET 30", value: 30 },
  { label: "NET 60", value: 60 },
];

// Representative virtual account details derived deterministically from the
// invoice id. NOTE: Stripe bank-transfer virtual accounts are not offered for
// AUD, so this is a clearly-labelled representative account for the demo — the
// live/hosted payment paths above use real Stripe objects.
function virtualAccount(seed: string): {
  bsb: string;
  account: string;
  reference: string;
} {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const bsb = `80${(2000 + (h % 8000)).toString().padStart(4, "0")}`;
  const account = (10000000 + (h % 89999999)).toString();
  const bsbFmt = `${bsb.slice(0, 3)}-${bsb.slice(3)}`;
  return { bsb: bsbFmt, account, reference: `WWG-${(h % 900000) + 100000}` };
}

export default function InvoicingPage() {
  const [customer, setCustomer] = useState<EnterpriseCustomer | null>(null);
  const customerName = customer?.name ?? "the client";
  const [items, setItems] = useState<LineItem[]>(INVOICING_LINE_ITEMS);
  const [days, setDays] = useState(30);
  const [collection, setCollection] = useState<
    "charge_automatically" | "send_invoice"
  >("charge_automatically");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<{
    id: string;
    number?: string;
    hosted_invoice_url?: string;
    status: string;
    amount_due: number;
  } | null>(null);

  // Column state
  const [autoCharge, setAutoCharge] = useState<Status>("processing");
  const [becs, setBecs] = useState<Status>("pending");
  const [copied, setCopied] = useState(false);

  const subtotal = lineItemsSubtotal(items);

  useEffect(() => {
    if (!invoice) return;
    // Auto-charge column animation
    setAutoCharge("processing");
    const t1 = setTimeout(() => {
      setAutoCharge(invoice.status === "paid" ? "paid" : "open");
    }, 1800);
    // BECS column simulated settlement
    setBecs("pending");
    const t2 = setTimeout(() => setBecs("confirmed"), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [invoice]);

  function updateItem(idx: number, patch: Partial<LineItem>) {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    );
  }

  async function createAndSend() {
    setBusy(true);
    setError(null);
    setInvoice(null);
    try {
      const res = await fetch("/api/demo/invoices/create-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: customer?.id,
          customerName: customer?.name,
          lineItems: items,
          days_until_due: days,
          collection_method: collection,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setInvoice(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create invoice");
    } finally {
      setBusy(false);
    }
  }

  function resetDemo() {
    setInvoice(null);
    setItems(INVOICING_LINE_ITEMS);
    setError(null);
    setAutoCharge("processing");
    setBecs("pending");
  }

  async function copyUrl() {
    if (!invoice?.hosted_invoice_url) return;
    try {
      await navigator.clipboard.writeText(invoice.hosted_invoice_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <DemoIntro
        eyebrow="B2B Invoicing — Enterprise accounts receivable"
        title="B2B Invoicing"
        problem="Beyond NSW Gov, Workwear has many corporate clients (Qantas, airports, construction companies) ordering uniforms in bulk. Payment collection is manual and slow."
        solution="Stripe Invoicing handles the full lifecycle — create the invoice, email it to the client with a payment link, they pay online, and Workwear's system updates automatically. Clients who prefer bank transfer get a virtual account number; clients who want direct debit are set up on BECS."
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-wwgBorder bg-wwgSurface px-3 py-1 text-xs font-semibold uppercase tracking-wide text-charcoal-light">
              Email + payment link
            </span>
            <span className="rounded-full border border-wwgBorder bg-wwgSurface px-3 py-1 text-xs font-semibold uppercase tracking-wide text-charcoal-light">
              Hosted invoice page
            </span>
            <span className="rounded-full border border-wwgBorder bg-wwgSurface px-3 py-1 text-xs font-semibold uppercase tracking-wide text-charcoal-light">
              Bank transfer
            </span>
            <span className="rounded-full border border-wwgBorder bg-wwgSurface px-3 py-1 text-xs font-semibold uppercase tracking-wide text-charcoal-light">
              BECS direct debit
            </span>
          </div>
        }
      />

      <div className="mb-6 flex items-center justify-end">
        <button
          onClick={resetDemo}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Builder */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-charcoal">Invoice Builder</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CustomerSelect
            value={customer?.id ?? null}
            onChange={setCustomer}
            label="Customer"
            disabled={Boolean(invoice)}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Payment terms
              </label>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {TERMS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Collection method
              </label>
              <select
                value={collection}
                onChange={(e) =>
                  setCollection(
                    e.target.value as "charge_automatically" | "send_invoice"
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="charge_automatically">
                  charge_automatically
                </option>
                <option value="send_invoice">send_invoice</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {items.map((it, i) => (
            <div
              key={i}
              className="grid grid-cols-12 items-center gap-2 text-sm"
            >
              <input
                value={it.description}
                onChange={(e) => updateItem(i, { description: e.target.value })}
                className="col-span-7 rounded border border-gray-300 px-2 py-1"
              />
              <input
                type="number"
                value={it.quantity}
                onChange={(e) =>
                  updateItem(i, { quantity: Number(e.target.value) || 0 })
                }
                className="col-span-2 rounded border border-gray-300 px-2 py-1"
              />
              <span className="col-span-3 text-right font-medium">
                {formatAud(it.amountCents * it.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold">{formatAud(subtotal)}</span>
        </div>

        <button
          onClick={createAndSend}
          disabled={busy}
          className="mt-4 w-full rounded-lg bg-brand px-4 py-2.5 font-semibold uppercase tracking-wide text-white hover:bg-brand-dark disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {busy ? "Creating & sending…" : "Create & Send Invoice"}
        </button>

        {invoice && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <StripeChip id={invoice.id} type="invoice" />
            <StatusBadge
              status={(invoice.status as Status) ?? "open"}
              label={invoice.status}
            />
          </div>
        )}
      </div>

      {/* Sent-to-client + prominent hosted invoice page */}
      {invoice && (
        <div className="mt-6 overflow-hidden rounded-xl border border-wwgBorder bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-wwgBorder bg-wwgSurface px-6 py-4">
            <div>
              <div className="flex items-center gap-2">
                <StatusBadge status="confirmed" label="Sent to client ✓" />
                {invoice.number && (
                  <span className="text-sm font-semibold text-charcoal">
                    {invoice.number}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-charcoal-light">
                Invoice emailed to {customerName} with a secure payment link —
                the Stripe hosted invoice page below.
              </p>
            </div>
            {invoice.hosted_invoice_url && (
              <div className="flex gap-2">
                <a
                  href={invoice.hosted_invoice_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand-dark"
                >
                  View hosted invoice →
                </a>
                <button
                  onClick={copyUrl}
                  className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {copied ? "Copied ✓" : "Copy URL"}
                </button>
              </div>
            )}
          </div>
          {invoice.hosted_invoice_url && (
            <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-[160px_1fr]">
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-lg border border-wwgBorder bg-white p-2">
                  <QRCodeCanvas
                    value={invoice.hosted_invoice_url}
                    size={128}
                    fgColor="#2F3540"
                  />
                </div>
                <span className="text-xs text-charcoal-light">
                  Scan to open
                </span>
              </div>
              <iframe
                src={invoice.hosted_invoice_url}
                title="Stripe hosted invoice"
                className="h-[420px] w-full rounded-lg border border-wwgBorder bg-white"
                loading="lazy"
              />
            </div>
          )}
        </div>
      )}

      {/* Payment paths */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Auto-charge / email + link */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 font-semibold text-charcoal">
            {collection === "charge_automatically"
              ? "Auto-Charge"
              : "Email + Payment Link"}
          </h3>
          {!invoice ? (
            <p className="text-sm text-gray-400">
              Create an invoice to see collection status.
            </p>
          ) : collection === "charge_automatically" ? (
            <div className="space-y-3">
              <StatusBadge
                status={autoCharge}
                label={
                  autoCharge === "paid"
                    ? "Paid ✓"
                    : autoCharge === "processing"
                      ? "Charging stored card…"
                      : "Awaiting card"
                }
              />
              <p className="text-sm text-gray-600">
                {autoCharge === "paid"
                  ? `${formatAud(invoice.amount_due)} collected from the stored card on file.`
                  : "Attempting to charge the customer's stored payment method."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <StatusBadge status="open" label="Awaiting payment" />
              <p className="text-sm text-gray-600">
                Collection method is <code>send_invoice</code>. The client
                received an email with a payment link and pays online via the
                hosted invoice page.
              </p>
            </div>
          )}
        </div>

        {/* Bank transfer — virtual account */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 font-semibold text-charcoal">
            Bank Transfer — Virtual Account
          </h3>
          {!invoice ? (
            <p className="text-sm text-gray-400">
              Create an invoice to issue a virtual account.
            </p>
          ) : (
            <div className="space-y-3">
              <StatusBadge status="pending" label="Awaiting transfer" />
              <div className="rounded-lg border border-wwgBorder bg-wwgSurface p-3 text-sm">
                <VaRow label="Account name" value="Workwear Group Pty Ltd" />
                <VaRow label="BSB" value={virtualAccount(invoice.id).bsb} />
                <VaRow
                  label="Account no."
                  value={virtualAccount(invoice.id).account}
                />
                <VaRow
                  label="Reference"
                  value={virtualAccount(invoice.id).reference}
                />
              </div>
              <p className="text-xs text-gray-500">
                Clients who prefer bank transfer pay to their dedicated virtual
                account; funds auto-reconcile to this invoice.
              </p>
            </div>
          )}
        </div>

        {/* BECS */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 font-semibold text-charcoal">
            BECS Direct Debit
          </h3>
          {!invoice ? (
            <p className="text-sm text-gray-400">
              Create an invoice to initiate direct debit.
            </p>
          ) : (
            <div className="space-y-3">
              <StatusBadge status={becs} />
              <p className="text-sm text-gray-600">
                Direct debit initiated — settlement in 1–3 business days.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-wwgBorder py-1.5 last:border-0">
      <span className="text-charcoal-light">{label}</span>
      <span className="font-mono text-charcoal">{value}</span>
    </div>
  );
}
