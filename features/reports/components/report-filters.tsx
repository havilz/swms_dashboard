import { reportStatuses } from "../domain/admin-report";

const statusLabels = {
  pending: "Menunggu",
  in_progress: "Diproses",
  completed: "Selesai",
  rejected: "Ditolak",
} as const;

export function ReportFilters({
  search,
  status,
}: {
  search: string;
  status: string;
}) {
  return (
    <form method="get" className="flex flex-col gap-3 rounded-xl border border-[#cbd8c8] bg-[#f8fbf6] p-4 sm:flex-row">
      <label className="min-w-0 flex-1">
        <span className="sr-only">Cari laporan</span>
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Cari judul, lokasi, atau pelapor"
          className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
        />
      </label>
      <label>
        <span className="sr-only">Filter status</span>
        <select
          name="status"
          defaultValue={status}
          className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-800 sm:w-48"
        >
          <option value="">Semua status</option>
          {reportStatuses.map((item) => (
            <option key={item} value={item}>{statusLabels[item]}</option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="min-h-10 rounded-lg bg-[#17392d] px-4 text-sm font-semibold text-white hover:bg-[#244c38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17392d]"
      >
        Terapkan filter
      </button>
    </form>
  );
}
