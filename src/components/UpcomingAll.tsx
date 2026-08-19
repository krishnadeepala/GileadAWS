import { useMemo, useState } from "react";
import { inspections, REGIONS, COUNTRIES, SITES, TYPES, LIFECYCLE } from "../data";
import { Button, Input, Select, StatusBadge } from "./ui";

export function UpcomingAll({ onBack, onOpen }: { onBack: () => void; onOpen: (id: string) => void }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");
  const [site, setSite] = useState("");
  const [phase, setPhase] = useState("");
  const [lead, setLead] = useState("");

  const leads = [...new Set(inspections.map((i) => i.lead))].sort();

  const rows = useMemo(
    () =>
      inspections
        .filter((i) => i.daysToInspection >= 0 && i.phase !== "Closed")
        .filter(
          (i) =>
            (!from || i.date >= from) &&
            (!to || i.date <= to) &&
            (!region || i.region === region) &&
            (!country || i.country === country) &&
            (!type || i.type === type) &&
            (!site || i.site === site) &&
            (!phase || i.phase === phase) &&
            (!lead || i.lead === lead)
        )
        .sort((a, b) => a.daysToInspection - b.daysToInspection),
    [from, to, region, country, type, site, phase, lead]
  );

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-6 xl:px-10">
      <button onClick={onBack} className="text-sm font-medium text-gilead-red hover:underline">← Back to Portfolio</button>
      <h1 className="mt-2 text-2xl font-semibold text-ink">Upcoming Scheduled Inspections</h1>
      <p className="mt-1 text-sm text-muted">All scheduled inspections that have not yet reached their inspection date.</p>

      <div className="mt-5 grid grid-cols-2 gap-2.5 rounded-lg border border-line bg-white p-4 md:grid-cols-4 lg:grid-cols-8">
        <label className="flex flex-col gap-1 text-xs font-medium text-gilead-gray">From<Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gilead-gray">To<Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gilead-gray">Region<Select value={region} onChange={(e) => setRegion(e.target.value)}><option value="">All</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}</Select></label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gilead-gray">Country<Select value={country} onChange={(e) => setCountry(e.target.value)}><option value="">All</option>{COUNTRIES.map((r) => <option key={r}>{r}</option>)}</Select></label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gilead-gray">Type<Select value={type} onChange={(e) => setType(e.target.value)}><option value="">All</option>{TYPES.map((r) => <option key={r}>{r}</option>)}</Select></label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gilead-gray">Site<Select value={site} onChange={(e) => setSite(e.target.value)}><option value="">All</option>{SITES.map((r) => <option key={r}>{r}</option>)}</Select></label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gilead-gray">Phase<Select value={phase} onChange={(e) => setPhase(e.target.value)}><option value="">All</option>{LIFECYCLE.filter((x) => x !== "Closed").map((r) => <option key={r}>{r}</option>)}</Select></label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gilead-gray">Lead<Select value={lead} onChange={(e) => setLead(e.target.value)}><option value="">All</option>{leads.map((r) => <option key={r}>{r}</option>)}</Select></label>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas/60 text-left text-xs uppercase tracking-wide text-gilead-gray">
                {["Countdown", "Date", "Inspection ID", "Name", "Country / Site", "Type", "Phase", "Lead", "Status"].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => (
                <tr key={i.id} className="border-b border-line/70 last:border-0 hover:bg-canvas/50">
                  <td className="px-4 py-3"><span className="font-semibold tabular-nums text-gilead-red">{i.daysToInspection}d</span></td>
                  <td className="px-4 py-3 tabular-nums text-gilead-gray">{i.date}</td>
                  <td className="px-4 py-3"><button onClick={() => onOpen(i.id)} className="font-medium text-gilead-red hover:underline">{i.id}</button></td>
                  <td className="px-4 py-3 font-medium text-ink">{i.name}</td>
                  <td className="px-4 py-3 text-gilead-gray">{i.country} · {i.site}</td>
                  <td className="px-4 py-3 text-gilead-gray">{i.type}</td>
                  <td className="px-4 py-3 text-gilead-gray">{i.phase}</td>
                  <td className="px-4 py-3 text-gilead-gray">{i.lead}</td>
                  <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={9} className="px-4 py-14 text-center text-muted">No upcoming inspections match the filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
