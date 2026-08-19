import type { ReactNode } from "react";
import type { Status } from "../data";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gilead-red/40 focus-visible:ring-offset-1 disabled:opacity-45 disabled:pointer-events-none whitespace-nowrap";
  const sizes = { sm: "h-8 px-3 text-[13px]", md: "h-9.5 px-4 text-sm" };
  const variants = {
    primary: "bg-gilead-red text-white hover:bg-gilead-red-dark shadow-sm",
    secondary: "bg-white text-ink border border-line hover:border-gilead-gray/50 hover:bg-canvas",
    ghost: "text-gilead-gray hover:text-ink hover:bg-canvas",
    danger: "bg-danger text-white hover:brightness-95",
  };
  return (
    <button className={cx(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

const statusStyles: Record<Status, string> = {
  Draft: "bg-canvas text-muted border-line",
  "On Track": "bg-success-tint text-success border-success/25",
  "At Risk": "bg-warning-tint text-warning border-warning/25",
  "In Progress": "bg-info-tint text-info border-info/25",
  "Awaiting Response": "bg-gilead-red-tint text-gilead-red border-gilead-red/25",
  Closed: "bg-canvas text-gilead-gray border-stone",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status]
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function TaskStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Complete: "bg-success-tint text-success",
    "In Progress": "bg-info-tint text-info",
    "Not Started": "bg-canvas text-muted",
    Blocked: "bg-danger-tint text-danger",
    Open: "bg-warning-tint text-warning",
  };
  return (
    <span className={cx("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", map[status] ?? "bg-canvas text-muted")}>
      {status}
    </span>
  );
}

export function Field({
  label,
  children,
  hint,
  required,
  className,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={cx("flex flex-col gap-1.5", className)}>
      <span className="text-[13px] font-medium text-gilead-gray">
        {label}
        {required && <span className="text-gilead-red"> *</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputCls =
  "h-9.5 w-full rounded-md border border-line bg-white px-3 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-gilead-gray/60 focus:ring-2 focus:ring-gilead-red/15 transition-colors";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(inputCls, props.className)} />;
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cx(
        inputCls,
        "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2354565b%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_0.6rem_center] bg-no-repeat pr-9",
        props.className
      )}
    >
      {children}
    </select>
  );
}

export function GVaultBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-stone bg-canvas px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gilead-gray">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></svg>
      G Vault
    </span>
  );
}

export function Card({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cx("rounded-lg border border-line bg-white", className)}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
