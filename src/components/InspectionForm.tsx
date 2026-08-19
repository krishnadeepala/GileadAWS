import { useState } from "react";
import { inspections, REGIONS, TYPES, LIFECYCLE, type Inspection } from "../data";
import { Button, Card, Field, GVaultBadge, Input, Select, cx } from "./ui";

export function InspectionForm({
  mode,
  id,
  onCancel,
  onDone,
}: {
  mode: "create" | "edit";
  id?: string;
  onCancel: () => void;
  onDone: (id: string) => void;
}) {
  const existing: Inspection | undefined = id ? inspections.find((i) => i.id === id) : undefined;
  const [saved, setSaved] = useState(false);
  const [f, setF] = useState({
    name: existing?.name ?? "",
    type: existing?.type ?? TYPES[0],
    region: existing?.region ?? REGIONS[0],
    country: existing?.country ?? "",
    site: existing?.site ?? "",
    agency: existing?.agency ?? "",
    scope: existing?.scope ?? "",
    phase: existing?.phase ?? "Readiness",
    lead: existing?.lead ?? "",
    sponsor: existing?.sponsor ?? "",
    date: existing?.date ?? "",
    support: existing?.support.map((s) => s.name).join(", ") ?? "",
    smes: existing?.smes.map((s) => s.name).join(", ") ?? "",
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const gvault = existing?.gvault ?? [
    { field: "Product", value: "— pending G Vault sync —" },
    { field: "Application No.", value: "— pending G Vault sync —" },
    { field: "Manufacturing License", value: "— pending G Vault sync —" },
    { field: "GxP Classification", value: "— pending G Vault sync —" },
  ];

  const submit = () => {
    setSaved(true);
    setTimeout(() => onDone(existing?.id ?? inspections[0].id), 850);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-6 xl:px-10">
      <button onClick={onCancel} className="text-sm font-medium text-gilead-red hover:underline">← {mode === "edit" ? "Back to Inspection" : "Back to Portfolio"}</button>
      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{mode === "create" ? "Create Inspection" : `Edit ${existing?.id}`}</h1>
          <p className="mt-1 text-sm text-muted">Only fields supported by the approved requirements are shown. G Vault fields are read-only.</p>
        </div>
      </div>

      {saved && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-success/30 bg-success-tint px-4 py-2.5 text-sm font-medium text-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" /></svg>
          {mode === "create" ? "Inspection created" : "Changes saved"} — redirecting to the inspection record…
        </div>
      )}

      <div className="mt-5 flex flex-col gap-5">
        <Card title="Basic Inspection Information">
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <Field label="Inspection Name / Reference" required className="sm:col-span-2">
              <Input value={f.name} onChange={set("name")} placeholder="e.g. Cork Sterile Fill-Finish PAI" />
            </Field>
            <Field label="Inspection Type" required>
              <Select value={f.type} onChange={set("type")}>{TYPES.map((t) => <option key={t}>{t}</option>)}</Select>
            </Field>
            <Field label="Regulatory Agency">
              <Input value={f.agency} onChange={set("agency")} placeholder="e.g. EMA, FDA, HPRA" />
            </Field>
            <Field label="Region" required>
              <Select value={f.region} onChange={set("region")}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</Select>
            </Field>
            <Field label="Country" required>
              <Input value={f.country} onChange={set("country")} placeholder="e.g. Ireland" />
            </Field>
            <Field label="Site / Location" required className="sm:col-span-2">
              <Input value={f.site} onChange={set("site")} placeholder="e.g. Cork Manufacturing" />
            </Field>
            <Field label="Inspection Scope" className="sm:col-span-2" hint="Brief summary of what the inspection covers.">
              <textarea value={f.scope} onChange={set("scope")} rows={3} className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-gilead-gray/60 focus:outline-none focus:ring-2 focus:ring-gilead-red/15" />
            </Field>
          </div>
        </Card>

        <Card title="Inspection Team">
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <Field label="Inspection Lead" required><Input value={f.lead} onChange={set("lead")} placeholder="Assign lead" /></Field>
            <Field label="Inspection Sponsor"><Input value={f.sponsor} onChange={set("sponsor")} placeholder="Assign sponsor" /></Field>
            <Field label="Support Team" hint="Comma-separated" className="sm:col-span-2"><Input value={f.support} onChange={set("support")} placeholder="e.g. Priya Shah, Carlos Mendez" /></Field>
            <Field label="Subject Matter Experts (SMEs)" hint="Comma-separated" className="sm:col-span-2"><Input value={f.smes} onChange={set("smes")} placeholder="e.g. Rani Kaur, David Nguyen" /></Field>
          </div>
        </Card>

        <Card title="Inspection Schedule">
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <Field label="Inspection Date" required><Input type="date" value={f.date} onChange={set("date")} /></Field>
            <Field label="Lifecycle Phase"><Select value={f.phase} onChange={set("phase")}>{LIFECYCLE.map((r) => <option key={r}>{r}</option>)}</Select></Field>
          </div>
        </Card>

        <Card title="Additional Metadata — G Vault Sourced" action={<GVaultBadge />}>
          <div className="border-b border-line bg-canvas/50 px-5 py-2 text-xs text-muted">
            These fields are received from G Vault and cannot be edited in this system.
          </div>
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            {gvault.map((g) => (
              <div key={g.field} className="flex flex-col gap-1.5">
                <span className="text-[13px] font-medium text-gilead-gray">{g.field}</span>
                <div className={cx("flex h-9.5 items-center rounded-md border border-dashed border-stone bg-canvas px-3 text-sm text-gilead-gray")}>{g.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="sticky bottom-0 mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-line bg-canvas/90 py-4 backdrop-blur">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="secondary" onClick={submit}>Save Draft</Button>
        <Button onClick={submit}>{mode === "create" ? "Create Inspection" : "Save Changes"}</Button>
      </div>
    </div>
  );
}
