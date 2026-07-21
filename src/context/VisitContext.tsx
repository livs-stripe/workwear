import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

// The customer visit a field rep is currently servicing. Company + site are
// required to start a visit; contact and PO number are optional.
export interface Visit {
  company: string;
  site: string;
  contact?: string;
  poNumber?: string;
}

interface VisitContextValue {
  visit: Visit | null;
  hasVisit: boolean;
  setVisit: (visit: Visit) => void;
  clearVisit: () => void;
}

const VisitContext = createContext<VisitContextValue | undefined>(undefined);

export const VisitProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [visit, setVisitState] = useState<Visit | null>(null);

  const setVisit = useCallback((next: Visit) => {
    setVisitState({
      company: next.company.trim(),
      site: next.site.trim(),
      contact: next.contact?.trim() || undefined,
      poNumber: next.poNumber?.trim() || undefined,
    });
  }, []);

  const clearVisit = useCallback(() => setVisitState(null), []);

  const value = useMemo<VisitContextValue>(
    () => ({
      visit,
      hasVisit: visit !== null,
      setVisit,
      clearVisit,
    }),
    [visit, setVisit, clearVisit],
  );

  return (
    <VisitContext.Provider value={value}>{children}</VisitContext.Provider>
  );
};

export function useVisit(): VisitContextValue {
  const ctx = useContext(VisitContext);
  if (!ctx) {
    throw new Error('useVisit must be used within a VisitProvider');
  }
  return ctx;
}

// Maps a visit to the flat string metadata attached to a PaymentIntent.
// Undefined fields are omitted so we never send empty strings to Stripe.
export function visitToMetadata(
  visit: Visit | null,
): Record<string, string> {
  if (!visit) {
    return {};
  }
  const meta: Record<string, string> = {
    company: visit.company,
    site: visit.site,
  };
  if (visit.contact) {
    meta.contact = visit.contact;
  }
  if (visit.poNumber) {
    meta.po_number = visit.poNumber;
  }
  return meta;
}
