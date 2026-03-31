import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div className="ss-field">
      <label className="ss-label">{label}</label>
      {children}
      {error && <span className="ss-field-error">{error}</span>}
    </div>
  );
}
