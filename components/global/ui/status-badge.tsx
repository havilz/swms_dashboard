import type { DashboardReport } from "@/features/dashboard/domain/dashboard-summary";

const statusPresentation: Record<
  DashboardReport["status"],
  { label: string; className: string }
> = {
  pending: { label: "Menunggu", className: "bg-amber-100 text-amber-800" },
  in_progress: { label: "Diproses", className: "bg-sky-100 text-sky-800" },
  completed: { label: "Selesai", className: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "Ditolak", className: "bg-rose-100 text-rose-800" },
};

export function StatusBadge({ status }: { status: DashboardReport["status"] }) {
  const presentation = statusPresentation[status];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${presentation.className}`}>
      {presentation.label}
    </span>
  );
}
