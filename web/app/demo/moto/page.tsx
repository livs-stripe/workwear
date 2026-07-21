"use client";

import { useState } from "react";
import StripeChip from "@/components/StripeChip";
import { MOTO_ACCOUNTS, formatAud } from "@/lib/data";

const TEST_CARDS = [
  { key: "visa", label: "Visa ···· 4242" },
  { key: "mastercard", label: "Mastercard ···· 4444" },
  { key: "amex", label: "Amex ···· 8431" },
  { key: "declined", label: "Declined ···· 0002" },
];

export default function MotoPage() {
  const [accountName, setAccountName] = useState(MOTO_ACCOUNTS[0].name);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [card, setCard] = useState("visa");
  const [piId, setPiId] = useState<string | null>(null);
  const [succeededPi, setSucceededPi] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const account =
    MOTO_ACCOUNTS.find((a) => a.name === accountName) ?? MOTO_ACCOUNTS[0];
  const invoice =
    account.invoices.find((i) => i.ref === selectedInvoice) ?? null;

  async function takePayment() {
    if (!invoice) return;
    setBusy(true);
    setError(null);
    setPiId(null);
    setSucceededPi(null);
    try {
      const res = await fetch("/api/demo/moto/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents: invoice.amountCents,
          customer_name: account.name,
          invoice_ref: invoice.ref,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setPiId(data.id);

      const confirmRes = await fetch("/api/demo/moto/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data.id, card }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) throw new Error(confirmData.error ?? "Failed");
      if (confirmData.status === "succeeded") {
        setSucceededPi(confirmData.id);
      } else {
        throw new Error(
          `Payment ${confirmData.status ?? "was not completed"} — try another card.`
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to take payment");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setSelectedInvoice(null);
    setNote("");
    setCard("visa");
    setPiId(null);
    setSucceededPi(null);
    setError(null);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="heading-din text-2xl font-bold text-charcoal">
            MOTO Payment Terminal
          </h1>
          <p className="text-gray-600">
            Finance staff take card payments over the phone on behalf of the
            customer.
          </p>
        </div>
        <button
          onClick={reset}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT: account lookup */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Customer account
          </label>
          <select
            value={accountName}
            onChange={(e) => {
              setAccountName(e.target.value);
              setSelectedInvoice(null);
              setPiId(null);
              setSucceededPi(null);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {MOTO_ACCOUNTS.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>

          <h3 className="mb-2 mt-5 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Outstanding invoices
          </h3>
          <div className="space-y-2">
            {account.invoices.map((inv) => {
              const active = selectedInvoice === inv.ref;
              return (
                <button
                  key={inv.ref}
                  onClick={() => {
                    setSelectedInvoice(inv.ref);
                    setPiId(null);
                    setSucceededPi(null);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                    active
                      ? "border-brand bg-brand-light"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div>
                    <p className="font-medium text-charcoal">
                      Invoice #{inv.ref}
                    </p>
                    <p className="text-xs text-gray-500">Due {inv.due}</p>
                  </div>
                  <span className="font-bold">
                    {formatAud(inv.amountCents)}
                  </span>
                </button>
              );
            })}
          </div>

          {invoice && (
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">
                Take payment for Invoice #{invoice.ref} —{" "}
                {formatAud(invoice.amountCents)}
              </p>
              <label className="mb-1 mt-3 block text-xs font-medium text-gray-600">
                Note (optional, added to payment metadata)
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Paid by A/P over phone, ref call #4821"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>

        {/* RIGHT: payment collection */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 font-semibold text-charcoal">
            Card Payment (MOTO)
          </h3>
          <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
            MOTO payment — card details are keyed in by finance staff on behalf
            of the customer. Ensure verbal consent has been obtained. The MOTO
            exemption is flagged on the PaymentIntent at confirmation.
          </div>

          {succeededPi ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="font-semibold text-green-800">
                Payment succeeded — {invoice && formatAud(invoice.amountCents)}
              </p>
              <p className="mt-1 text-sm text-green-700">
                Charged as a MOTO transaction (SCA-exempt) — no cardholder
                authentication required.
              </p>
              <div className="mt-2">
                <StripeChip id={succeededPi} type="payment_intent" />
              </div>
            </div>
          ) : !invoice ? (
            <p className="text-sm text-gray-400">
              Select an outstanding invoice to collect payment.
            </p>
          ) : (
            <>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Card provided over the phone
              </label>
              <select
                value={card}
                onChange={(e) => setCard(e.target.value)}
                className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {TEST_CARDS.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
              {piId && !succeededPi && (
                <div className="mb-3">
                  <StripeChip id={piId} type="payment_intent" />
                </div>
              )}
              <button
                onClick={takePayment}
                disabled={busy}
                className="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold uppercase tracking-wide text-white hover:bg-brand-dark disabled:opacity-60"
              >
                {busy
                  ? "Charging…"
                  : `Charge ${formatAud(invoice.amountCents)}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
