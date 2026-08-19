import { useState } from "react";
import type { Role } from "./data";
import { cx } from "./components/ui";
import { Dashboard } from "./components/Dashboard";
import { UpcomingAll } from "./components/UpcomingAll";
import { InspectionForm } from "./components/InspectionForm";
import { InspectionView } from "./components/InspectionView";

type View =
  | { name: "dashboard" }
  | { name: "upcoming" }
  | { name: "create" }
  | { name: "edit"; id: string }
  | { name: "view"; id: string };

const ROLES: Role[] = ["Super User", "Inspection Lead", "SME", "Inspection Sponsor", "Leadership"];

export default function App() {
  const [role, setRole] = useState<Role>("Super User");
  const [view, setView] = useState<View>({ name: "dashboard" });
  const [roleMenu, setRoleMenu] = useState(false);

  const go = (v: View) => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="flex min-h-full flex-col bg-canvas">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-15 max-w-[1500px] items-center gap-4 px-6 xl:px-10">
          <button onClick={() => go({ name: "dashboard" })} className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-md bg-gilead-red font-semibold text-white">G</span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-semibold text-ink">Gilead</span>
              <span className="text-[11px] text-muted">Inspection Command Center</span>
            </span>
          </button>

          <div className="relative ml-4 hidden max-w-md flex-1 md:block">
            <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder="Search inspections, sites, leads…" className="h-9 w-full rounded-md border border-line bg-canvas/70 pl-9 pr-3 text-sm placeholder:text-muted/70 focus:border-gilead-gray/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gilead-red/15" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative flex size-9 items-center justify-center rounded-md text-gilead-gray hover:bg-canvas">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-gilead-red ring-2 ring-white" />
            </button>

            <div className="relative">
              <button
                onClick={() => setRoleMenu((v) => !v)}
                onBlur={() => setTimeout(() => setRoleMenu(false), 150)}
                className="flex items-center gap-2.5 rounded-md border border-line py-1 pl-1 pr-2.5 hover:bg-canvas"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-gilead-black text-xs font-semibold text-white">JD</span>
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block text-[13px] font-medium text-ink">Jordan Doyle</span>
                  <span className="block text-[11px] text-gilead-red">{role}</span>
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              {roleMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-56 overflow-hidden rounded-lg border border-line bg-white py-1 shadow-lg">
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Preview as role</p>
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      onMouseDown={() => { setRole(r); go({ name: "dashboard" }); }}
                      className={cx("flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-canvas", r === role ? "font-medium text-gilead-red" : "text-gilead-gray")}
                    >
                      {r}
                      {r === role && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {view.name === "dashboard" && (
          <Dashboard
            role={role}
            onOpen={(id) => go({ name: "view", id })}
            onEdit={(id) => go({ name: "edit", id })}
            onCreate={() => go({ name: "create" })}
            onViewAll={() => go({ name: "upcoming" })}
          />
        )}
        {view.name === "upcoming" && (
          <UpcomingAll onBack={() => go({ name: "dashboard" })} onOpen={(id) => go({ name: "view", id })} />
        )}
        {view.name === "create" && (
          <InspectionForm mode="create" onCancel={() => go({ name: "dashboard" })} onDone={(id) => go({ name: "view", id })} />
        )}
        {view.name === "edit" && (
          <InspectionForm mode="edit" id={view.id} onCancel={() => go({ name: "view", id: view.id })} onDone={(id) => go({ name: "view", id })} />
        )}
        {view.name === "view" && (
          <InspectionView id={view.id} role={role} onBack={() => go({ name: "dashboard" })} onEdit={(id) => go({ name: "edit", id })} />
        )}
      </main>

      <footer className="border-t border-line bg-white py-4">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-2 px-6 text-xs text-muted xl:px-10">
          <span>Gilead Inspection Tool · Prototype</span>
          <span>Fields not explicitly defined use neutral UX patterns pending BA confirmation.</span>
        </div>
      </footer>
    </div>
  );
}
