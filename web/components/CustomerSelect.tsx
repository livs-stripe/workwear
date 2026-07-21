"use client";

import { useEffect, useState } from "react";

export interface EnterpriseCustomer {
  id: string;
  name: string;
  email: string;
}

interface Props {
  value: string | null;
  onChange: (customer: EnterpriseCustomer | null) => void;
  label?: string;
  disabled?: boolean;
}

/**
 * Dropdown of real, seeded Workwear Group enterprise Stripe customers. On first
 * load it lists the customers; if none exist yet it seeds them, then lists.
 * Selecting one surfaces its real cus_ id to the parent for invoice creation.
 */
export default function CustomerSelect({
  value,
  onChange,
  label = "Customer",
  disabled,
}: Props) {
  const [customers, setCustomers] = useState<EnterpriseCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        let res = await fetch("/api/demo/customers");
        let data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load customers");

        if (!data.customers || data.customers.length === 0) {
          const seedRes = await fetch("/api/demo/customers/seed", {
            method: "POST",
          });
          data = await seedRes.json();
          if (!seedRes.ok) throw new Error(data.error ?? "Failed to seed");
          res = seedRes;
        }

        const list: EnterpriseCustomer[] = data.customers ?? [];
        if (cancelled) return;
        setCustomers(list);
        if (list.length > 0 && !value) onChange(list[0]);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load customers");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        value={value ?? ""}
        disabled={disabled || loading || customers.length === 0}
        onChange={(e) => {
          const c = customers.find((x) => x.id === e.target.value) ?? null;
          onChange(c);
        }}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
      >
        {loading && <option>Loading enterprise accounts…</option>}
        {!loading && customers.length === 0 && (
          <option>No customers available</option>
        )}
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {value && !error && (
        <p className="mt-1 font-mono text-[11px] text-wwgGrey">{value}</p>
      )}
    </div>
  );
}
