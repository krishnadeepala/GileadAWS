import { useState } from "react";
import { inspections, kappas, type Inspection, type Role } from "../data";
import { Button, Card, GVaultBadge, StatusBadge, TaskStatusBadge, cx } from "./ui";
import { Lifecycle } from "./Lifecycle";

type Tab =
  | "Overview"
  | "Checklists & Tasks"
  | "SMEs"
  | "G Vault"
  | "Documents"
  | "Scribe"
  | "Chat"
  | "Daily Debrief"
  | "Corrective Actions"
  | "Audit Trail";

export function InspectionView({
  id,
  role,
  onBack,
  onEdit,
}: {
  id: string;
  role: Role;
  onBack: () => void;
  onEdit: (id: string) => void;
}) {
  const insp = inspections.find((i) => i.id === id) as Inspection;
  const [tab, setTab] = useState<Tab>("Overview");
  const [activeChecklist, setActiveChecklist] = useState(0);

  const canEdit = (role === "Super User" || role === "Inspection Lead") && insp.phase !== "Closed";
  const showKappas = insp.phase === "Post-Conduct" || insp.phase === "Closed";

  const tabs: Tab[] = [
    "Overview",
    "Checklists & Tasks",
    "SMEs",
    "G Vault",
    "Documents",
    "Scribe",
    "Chat",
    "Daily Debrief",
    ...(showKappas ? (["Corrective Actions"] as Tab[]) : []),
    "Audit Trail",
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-6 xl:px-10">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onBack} className="text-sm font-medium text-gilead-red hover:underline">← Back to Portfolio</button>
        {insp.phase === "Conduct" && insp.daysToInspection === 0 && (
          <Button size="sm">Move to Post-Conduct</Button>
        )}
        {insp.phase === "Prep Scheduled" && insp.daysToInspection === 0 && (
          <Button size="sm">Move to In Progress</Button>
        )}
      </div>

      {/* Header */}
      <div className="mt-3 rounded-lg border border-line bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gilead-red">{insp.id}</span>
              <StatusBadge status={insp.status} />
            </div>
            <h1 className="mt-1.5 text-2xl font-semibold text-ink">{insp.name}</h1>
          </div>
          {canEdit && <Button variant="secondary" onClick={() => onEdit(insp.id)}>Edit Inspection</Button>}
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["Type", insp.type],
            ["Agency", insp.agency],
            ["Site / Country", `${insp.site}, ${insp.country}`],
            ["Inspection Lead", insp.lead],
            ["Inspection Date", insp.date],
            ["Sponsor", insp.sponsor],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase tracking-wide text-muted">{k}</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 border-t border-line pt-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gilead-gray">Inspection Lifecycle</span>
            <span className="text-xs text-muted">Last updated {insp.updated}</span>
          </div>
          <Lifecycle current={insp.phase} daysToInspection={insp.daysToInspection} />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 overflow-x-auto border-b border-line">
        <div className="flex min-w-max gap-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cx(
                "relative px-3.5 py-2.5 text-sm font-medium transition-colors",
                tab === t ? "text-gilead-red" : "text-gilead-gray hover:text-ink"
              )}
            >
              {t}
              {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gilead-red" />}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        {tab === "Overview" && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="flex flex-col gap-5 lg:col-span-2">
              <Card title="Inspection Information">
                <div className="p-5 text-sm text-gilead-gray">
                  <p className="leading-relaxed">{insp.scope}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-4">
                    {[["Region", insp.region], ["Phase", insp.phase], ["Support Team", insp.support.map((s) => s.name).join(", ")], ["Days to Inspection", insp.daysToInspection >= 0 ? `${insp.daysToInspection}` : "Passed"]].map(([k, v]) => (
                      <div key={k}><dt className="text-xs uppercase tracking-wide text-muted">{k}</dt><dd className="mt-0.5 font-medium text-ink">{v}</dd></div>
                    ))}
                  </dl>
                </div>
              </Card>
              <Card title="Related Inspections">
                <ul className="divide-y divide-line">
                  {insp.related.map((r) => (
                    <li key={r.id} className="flex items-center justify-between px-5 py-3 text-sm">
                      <div><span className="font-medium text-gilead-red">{r.id}</span><span className="ml-3 text-gilead-gray">{r.name}</span></div>
                      <span className="rounded-full bg-canvas px-2 py-0.5 text-xs text-muted">{r.relation}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
            <div className="flex flex-col gap-5">
              <Card title="G Vault" action={<GVaultBadge />}>
                <div className="border-b border-line bg-canvas/50 px-5 py-2 text-xs text-muted">Read Only — From G Vault</div>
                <dl className="divide-y divide-line">
                  {insp.gvault.map((g) => (
                    <div key={g.field} className="flex items-center justify-between px-5 py-2.5 text-sm">
                      <dt className="text-gilead-gray">{g.field}</dt><dd className="font-medium text-ink">{g.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
              <Card title="Supporting Information">
                <ul className="divide-y divide-line text-sm">
                  {["Inspection logistics plan v3", "Front room / back room seating map", "Escalation contact sheet"].map((s) => (
                    <li key={s} className="flex items-center gap-2 px-5 py-3 text-gilead-gray hover:text-ink">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        )}

        {tab === "Checklists & Tasks" && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
            <Card title="Checklist Categories">
              <ul className="max-h-[520px] overflow-y-auto p-2">
                {insp.checklists.map((c, i) => {
                  const done = c.tasks.filter((t) => t.status === "Complete").length;
                  return (
                    <li key={c.category}>
                      <button
                        onClick={() => setActiveChecklist(i)}
                        className={cx(
                          "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm",
                          i === activeChecklist ? "bg-gilead-red-tint font-medium text-gilead-red" : "text-gilead-gray hover:bg-canvas"
                        )}
                      >
                        <span className="truncate">{c.category}</span>
                        <span className="ml-2 shrink-0 text-xs tabular-nums text-muted">{done}/{c.tasks.length}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
            <Card title={insp.checklists[activeChecklist].category}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-line bg-canvas/60 text-left text-xs uppercase tracking-wide text-gilead-gray">
                      {["Task ID", "Description", "Owner / SME", "Due", "Status"].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {insp.checklists[activeChecklist].tasks.map((t) => (
                      <tr key={t.id} className="border-b border-line/70 last:border-0 hover:bg-canvas/50">
                        <td className="px-4 py-3 font-medium text-gilead-red">{t.id}</td>
                        <td className="px-4 py-3 text-ink">{t.description}</td>
                        <td className="px-4 py-3 text-gilead-gray">{t.owner}</td>
                        <td className="px-4 py-3 tabular-nums text-gilead-gray">{t.due}</td>
                        <td className="px-4 py-3"><TaskStatusBadge status={t.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {tab === "SMEs" && (
          <Card title="Subject Matter Experts">
            <p className="border-b border-line px-5 py-2.5 text-xs text-muted">SMEs assigned to this inspection and its checklist tasks.</p>
            <ul className="divide-y divide-line">
              {insp.smes.map((s) => (
                <li key={s.email} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="flex size-9 items-center justify-center rounded-full bg-gilead-red-tint text-sm font-semibold text-gilead-red">
                    {s.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div className="min-w-0 flex-1"><div className="font-medium text-ink">{s.name}</div><div className="text-xs text-muted">{s.email}</div></div>
                  <span className="rounded-full bg-canvas px-2.5 py-0.5 text-xs text-gilead-gray">{s.role}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {tab === "G Vault" && (
          <Card title="G Vault Information" action={<GVaultBadge />}>
            <div className="border-b border-line bg-canvas/50 px-5 py-2.5 text-sm text-gilead-gray">
              <span className="font-medium">Read Only — From G Vault.</span> This system reads this information and does not write back to G Vault.
            </div>
            <dl className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0">
              {insp.gvault.map((g) => (
                <div key={g.field} className="border-line px-5 py-4 sm:border-b">
                  <dt className="text-xs uppercase tracking-wide text-muted">{g.field}</dt>
                  <dd className="mt-1 text-sm font-medium text-ink">{g.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        )}

        {tab === "Documents" && (
          <Card title="Inspection Folder Structure">
            <p className="border-b border-line px-5 py-2.5 text-xs text-muted">Documents are linked to the inspection, checklist, task, or agency request.</p>
            <ul className="p-2 text-sm">
              {[
                { name: "01 · Inspection Plan", linked: "Inspection", files: 6 },
                { name: "02 · Agency Requests", linked: "Requests", files: 12 },
                { name: "03 · Standard Documents", linked: "Checklist", files: 24 },
                { name: "04 · Pre-Inspection Requests", linked: "Tasks", files: 9 },
                { name: "05 · Daily Debrief Packs", linked: "Inspection", files: 3 },
              ].map((d) => (
                <li key={d.name} className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-canvas">
                  <svg className="text-gilead-red" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9L9.6 3.9A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>
                  <span className="flex-1 font-medium text-ink">{d.name}</span>
                  <span className="rounded-full bg-canvas px-2 py-0.5 text-xs text-muted">Linked: {d.linked}</span>
                  <span className="w-14 text-right text-xs tabular-nums text-muted">{d.files} files</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {tab === "Scribe" && (
          <Card title="Scribe — Real-time Inspection Notes" action={<span className="text-xs text-muted">2 active scribes · not recorded</span>}>
            <div className="border-b border-line bg-canvas/50 px-5 py-2 text-xs text-muted">Inspection sessions are documented manually and are not audio/video recorded.</div>
            <ul className="divide-y divide-line">
              {insp.scribe.map((s, i) => (
                <li key={i} className="flex gap-4 px-5 py-3.5">
                  <span className="w-14 shrink-0 pt-0.5 text-xs font-medium tabular-nums text-gilead-red">{s.time}</span>
                  <div className="min-w-0"><p className="text-sm text-ink">{s.note}</p><span className="mt-0.5 block text-xs text-muted">— {s.author}</span></div>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 border-t border-line p-4">
              <input placeholder="Add a scribe note…" className="h-9.5 flex-1 rounded-md border border-line px-3 text-sm focus:border-gilead-gray/60 focus:outline-none focus:ring-2 focus:ring-gilead-red/15" />
              <Button>Add Note</Button>
            </div>
          </Card>
        )}

        {tab === "Chat" && (
          <Card title="Inspection Chat" action={<span className="rounded-full bg-canvas px-2.5 py-0.5 text-xs text-gilead-gray">{insp.id} · Back Room Team</span>}>
            <div className="flex flex-col gap-3 p-5">
              {insp.chat.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gilead-red-tint text-xs font-semibold text-gilead-red">{c.author.split(" ").map((n) => n[0]).join("")}</span>
                  <div className="rounded-lg rounded-tl-none border border-line bg-canvas/60 px-3.5 py-2">
                    <div className="flex items-baseline gap-2"><span className="text-[13px] font-medium text-ink">{c.author}</span><span className="text-xs text-muted">{c.time}</span></div>
                    <p className="text-sm text-gilead-gray">{c.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-line p-4">
              <input placeholder="Message the inspection team…" className="h-9.5 flex-1 rounded-md border border-line px-3 text-sm focus:border-gilead-gray/60 focus:outline-none focus:ring-2 focus:ring-gilead-red/15" />
              <Button>Send</Button>
            </div>
          </Card>
        )}

        {tab === "Daily Debrief" && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Card title="Daily Summary — 19 Aug 2026" className="lg:col-span-2">
              <div className="space-y-4 p-5 text-sm text-gilead-gray">
                <p className="leading-relaxed">Opening meeting completed on schedule. Scope confirmed as filed with no changes requested. Two document requests received and assigned. No observations raised during morning sessions.</p>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-ink">Actions Created Today</h4>
                  <ul className="mt-2 space-y-1.5">
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-gilead-red" /> Provide batch record VK-2261 — D. Nguyen</li>
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-gilead-red" /> Confirm EM trend documentation — R. Kaur</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-line px-5 py-3">
                <span className="text-xs text-muted">Auto-generated daily summary email is scheduled for 18:00 local time.</span>
                <Button size="sm" variant="secondary">Send Summary Email</Button>
              </div>
            </Card>
            <Card title="Today's Scribe Notes">
              <ul className="divide-y divide-line">
                {insp.scribe.map((s, i) => (
                  <li key={i} className="px-5 py-3 text-sm"><span className="text-xs font-medium text-gilead-red">{s.time}</span><p className="mt-0.5 text-gilead-gray">{s.note}</p></li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {tab === "Corrective Actions" && (
          <Card title="Corrective Actions / Findings (Kappas)" action={<GVaultBadge />}>
            <div className="border-b border-line bg-canvas/50 px-5 py-2.5 text-sm text-gilead-gray">
              <span className="font-medium">Kappas are managed in G Vault.</span> This system reads the information and does not write back to G Vault.
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-canvas/60 text-left text-xs uppercase tracking-wide text-gilead-gray">
                    {["Kappa ID", "Finding", "Severity", "Owner", "Due", "Status"].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {kappas.map((k) => (
                    <tr key={k.id} className="border-b border-line/70 last:border-0 hover:bg-canvas/50">
                      <td className="px-4 py-3 font-medium text-gilead-red">{k.id}</td>
                      <td className="px-4 py-3 text-ink">{k.finding}</td>
                      <td className="px-4 py-3"><span className={cx("rounded-full px-2 py-0.5 text-xs font-medium", k.severity === "Major" ? "bg-warning-tint text-warning" : "bg-canvas text-gilead-gray")}>{k.severity}</span></td>
                      <td className="px-4 py-3 text-gilead-gray">{k.owner}</td>
                      <td className="px-4 py-3 tabular-nums text-gilead-gray">{k.due}</td>
                      <td className="px-4 py-3"><TaskStatusBadge status={k.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === "Audit Trail" && (
          <Card title="Audit Trail">
            <ol className="relative ml-5 border-l border-line py-2">
              {insp.audit.map((a, i) => (
                <li key={i} className="relative py-3 pl-6">
                  <span className="absolute -left-[7px] top-4 size-3 rounded-full border-2 border-white bg-gilead-red/70" />
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-sm font-medium text-ink">{a.action}</span>
                    <span className="text-xs text-muted tabular-nums">{a.when}</span>
                  </div>
                  <span className="text-xs text-gilead-gray">{a.who}</span>
                </li>
              ))}
            </ol>
          </Card>
        )}
      </div>
    </div>
  );
}
