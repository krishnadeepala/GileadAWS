import { useMemo, useState } from "react";
import { inspections, REGIONS, COUNTRIES, SITES, TYPES, LIFECYCLE, type Role } from "../data";
import { Button, Select, StatusBadge, cx } from "./ui";

const PAGE_SIZE = 10;

function filterForRole(role: Role) {
  // Role-based visibility over the same core portfolio.
  switch (role) {
    case "Inspection Lead":
      return inspections.filter((i) => ["Maria Alvarez"].includes(i.lead));
    case "SME":
      return inspections.filter((i) => i.smes.some((s) => s.name === "Rani Kaur") && i.phase !== "Closed");
    case "Inspection Sponsor":
      return inspections.filter((i) => i.sponsor === "Jonathan Pryce");
    case "Leadership":
      return inspections;
    default:
      return inspections;
  }
}

export function Dashboard({
  role,
  onOpen,
  onEdit,
  onCreate,
  onViewAll,
}: {
  role: Role;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onCreate: () => void;
  onViewAll: () => void;
}) {
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");
  const [phase, setPhase] = useState("");
  const [site, setSite] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);

  const canManage = role === "Super User" || role === "Inspection Lead";
  const readOnly = role === "Inspection Sponsor" || role === "Leadership";

  const scoped = useMemo(() => filterForRole(role), [role]);

  const rows = useMemo(() => {
    return scoped.filter(
      (i) =>
        (!region || i.region === region) &&
        (!country || i.country === country) &&
        (!type || i.type === type) &&
        (!phase || i.phase === phase) &&
        (!site || i.site === site) &&
        (!q ||
          [i.id, i.name, i.lead, i.country, i.site].join(" ").toLowerCase().includes(q.toLowerCase()))
    );
  }, [scoped, region, country, type, phase, site, q]);

  const upcoming = scoped.filter((i) => i.daysToInspection >= 0 && i.phase !== "Closed");
  const within = (d: number) => upcoming.filter((i) => i.daysToInspection <= d).length;

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const p = Math.min(page, pageCount - 1);
  const pageRows = rows.slice(p * PAGE_SIZE, p * PAGE_SIZE + PAGE_SIZE);

  const resetPage = () => setPage(0);

  return (
    <div className="mx-auto max-w-[1500px] px-6 py-6 xl:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gilead-red">Inspection Command Center</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">Inspection Portfolio</h1>
          <p className="mt-1 text-sm text-muted">
            {readOnly ? "Read-only view of inspections relevant to your role." : "All active and closed inspection records across sites."}
          </p>
        </div>
        {canManage && (
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="md">Reports &amp; Dashboards</Button>
            <Button variant="secondary" size="md">Manage Templates</Button>
            <Button onClick={onCreate}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
              Create Inspection
            </Button>
          </div>
        )}
      </div>

      {/* Upcoming Scheduled Inspections — compact strip */}
      <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-lg border border-line bg-white px-5 py-3">
        <span className="text-[13px] font-semibold text-ink">Upcoming Scheduled Inspections</span>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
          {[
            ["Next 30 Days", within(30)],
            ["Next 60 Days", within(60)],
            ["Next 90 Days", within(90)],
          ].map(([label, n]) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="text-lg font-semibold tabular-nums text-gilead-red">{n}</span>
              <span className="text-[13px] text-gilead-gray">{label}</span>
            </div>
          ))}
        </div>
        <button onClick={onViewAll} className="ml-auto text-[13px] font-medium text-gilead-red hover:text-gilead-red-dark hover:underline">
          View All →
        </button>
      </div>

      {/* Filters */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        <div className="relative col-span-2 sm:col-span-3 lg:col-span-2">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); resetPage(); }}
            placeholder="Search ID, name, lead, site…"
            className="h-9.5 w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm placeholder:text-muted/60 focus:border-gilead-gray/60 focus:outline-none focus:ring-2 focus:ring-gilead-red/15"
          />
        </div>
        <Select value={region} onChange={(e) => { setRegion(e.target.value); resetPage(); }}>
          <option value="">All Regions</option>
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </Select>
        <Select value={country} onChange={(e) => { setCountry(e.target.value); resetPage(); }}>
          <option value="">All Countries</option>
          {COUNTRIES.map((r) => <option key={r}>{r}</option>)}
        </Select>
        <Select value={type} onChange={(e) => { setType(e.target.value); resetPage(); }}>
          <option value="">All Types</option>
          {TYPES.map((r) => <option key={r}>{r}</option>)}
        </Select>
        <Select value={phase} onChange={(e) => { setPhase(e.target.value); resetPage(); }}>
          <option value="">All Phases</option>
          {LIFECYCLE.map((r) => <option key={r}>{r}</option>)}
        </Select>
        <Select value={site} onChange={(e) => { setSite(e.target.value); resetPage(); }} className="lg:col-start-6">
          <option value="">All Sites</option>
          {SITES.map((r) => <option key={r}>{r}</option>)}
        </Select>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-lg border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas/60 text-left text-xs uppercase tracking-wide text-gilead-gray">
                {["Inspection ID", "Name", "Country / Site", "Type", "Phase", "Status", "Date", "Lead", "Updated", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((i) => (
                <tr key={i.id} className="group border-b border-line/70 last:border-0 hover:bg-canvas/50">
                  <td className="px-4 py-3">
                    <button onClick={() => onOpen(i.id)} className="font-medium text-gilead-red hover:underline">{i.id}</button>
                  </td>
                  <td className="max-w-[240px] px-4 py-3">
                    <div className="truncate font-medium text-ink">{i.name}</div>
                    <div className="text-xs text-muted">{i.agency}</div>
                  </td>
                  <td className="px-4 py-3 text-gilead-gray"><div>{i.country}</div><div className="text-xs text-muted">{i.site}</div></td>
                  <td className="px-4 py-3 text-gilead-gray">{i.type}</td>
                  <td className="px-4 py-3">
                    <span className={cx("text-[13px]", i.phase === "Closed" ? "text-muted" : "text-ink")}>{i.phase}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                  <td className="px-4 py-3 tabular-nums text-gilead-gray">{i.date}</td>
                  <td className="px-4 py-3 text-gilead-gray">{i.lead}</td>
                  <td className="px-4 py-3 tabular-nums text-muted">{i.updated}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                      <Button size="sm" variant="ghost" onClick={() => onOpen(i.id)}>View</Button>
                      {canManage && i.phase !== "Closed" && (
                        <Button size="sm" variant="secondary" onClick={() => onEdit(i.id)}>Edit</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-16 text-center text-sm text-muted">No inspections match the current filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-muted">
          <span>
            Showing <span className="font-medium text-ink">{rows.length === 0 ? 0 : p * PAGE_SIZE + 1}–{Math.min(rows.length, p * PAGE_SIZE + PAGE_SIZE)}</span> of{" "}
            <span className="font-medium text-ink">{rows.length}</span> · 10 rows per page
          </span>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="secondary" disabled={p === 0} onClick={() => setPage(p - 1)}>Prev</Button>
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cx(
                  "size-8 rounded-md text-[13px] font-medium",
                  i === p ? "bg-gilead-red text-white" : "text-gilead-gray hover:bg-canvas"
                )}
              >
                {i + 1}
              </button>
            ))}
            <Button size="sm" variant="secondary" disabled={p >= pageCount - 1} onClick={() => setPage(p + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
