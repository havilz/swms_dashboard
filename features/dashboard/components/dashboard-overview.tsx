import Link from "next/link";
import type { DashboardSummary } from "../domain/dashboard-summary";
import { StatusBadge } from "@/components/global/ui/status-badge";

const numberFormatter = new Intl.NumberFormat("id-ID");

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Waktu tidak tersedia";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function StatCard({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: number;
  note: string;
  tone: "forest" | "amber" | "teal" | "green" | "olive";
}) {
  const tones = {
    forest: "border-[#cbd8c8] border-t-[#527765] bg-[#f0f5ed] text-slate-900",
    amber: "border-[#ead9a7] border-t-[#c59028] bg-[#fff8e5] text-amber-700",
    teal: "border-[#c4ddd7] border-t-[#397d73] bg-[#edf6f3] text-sky-700",
    green: "border-[#bed8c0] border-t-[#3e8050] bg-[#edf7ed] text-emerald-700",
    olive: "border-[#d2d8bf] border-t-[#788452] bg-[#f2f4e8] text-slate-900",
  } satisfies Record<typeof tone, string>;

  return (
    <article className={`min-h-32 rounded-xl border border-t-4 p-4 sm:p-5 ${tones[tone]}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight">
        {numberFormatter.format(value)}
      </p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </article>
  );
}

export function DashboardOverview({ summary }: { summary: DashboardSummary }) {
  const { stats, recentReports } = summary;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-[#cbd8c8] bg-[#e8eee7] p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-800">Operasional laporan sampah</p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Mulai dari laporan yang menunggu verifikasi, lalu lanjutkan antrean yang sedang diproses.
          </p>
        </div>
        <Link
          href="/reports"
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
        >
          Buka semua laporan
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-5" aria-label="Ringkasan laporan">
        <StatCard label="Semua laporan" value={stats.totalReports} note="seluruh riwayat masuk" tone="forest" />
        <StatCard label="Menunggu verifikasi" value={stats.pending} note="perlu ditinjau admin" tone="amber" />
        <StatCard label="Sedang diproses" value={stats.inProgress} note="berada di antrean petugas" tone="teal" />
        <StatCard label="Selesai" value={stats.completed} note="sudah ditangani" tone="green" />
        <StatCard label="Pengguna terdaftar" value={stats.totalUsers} note="akun warga di sistem" tone="olive" />
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0" aria-labelledby="recent-reports-title">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <h2 id="recent-reports-title" className="text-base font-semibold text-slate-900">Laporan terbaru</h2>
              <p className="mt-1 text-sm text-slate-500">Antrean terbaru yang masuk ke sistem.</p>
            </div>
            <Link href="/reports" className="shrink-0 text-sm font-medium text-emerald-800 hover:text-emerald-950 hover:underline">
              Lihat semua
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#cbd8c8] bg-[#f8fbf6]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs font-medium text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3">Pelapor</th>
                    <th scope="col" className="px-5 py-3">Laporan</th>
                    <th scope="col" className="px-5 py-3">Status</th>
                    <th scope="col" className="px-5 py-3">Masuk</th>
                    <th scope="col" className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentReports.map((report) => (
                    <tr key={report.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4 align-top">
                        <p className="font-medium text-slate-900">{report.userName}</p>
                        <p className="mt-1 text-xs text-slate-500">{report.userEmail}</p>
                      </td>
                      <td className="max-w-xs px-5 py-4 align-top">
                        <p className="truncate font-medium text-slate-900">{report.title}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{report.locationAddress}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 align-top">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 align-top text-xs tabular-nums text-slate-500">
                        {formatDate(report.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right align-top">
                        <Link
                          href={`/reports/${report.id}`}
                          className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-emerald-800"
                        >
                          Buka
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {recentReports.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">
                        Belum ada laporan sampah yang masuk.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="space-y-5" aria-label="Tindakan berikutnya">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Tindakan berikutnya</h2>
            <p className="mt-1 text-sm text-slate-500">Antrean yang paling membutuhkan perhatian.</p>
          </div>

          <div className="rounded-xl border border-[#cbd8c8] bg-[#f8fbf6]">
            <Link
              href="/reports?status=pending"
              className="flex items-start justify-between gap-4 border-b border-slate-100 p-4 transition hover:bg-slate-50"
            >
              <span>
                <span className="block text-sm font-medium text-slate-900">Tinjau laporan baru</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">Pastikan lokasi dan isi laporan sudah jelas.</span>
              </span>
              <span className="shrink-0 text-lg font-semibold tabular-nums text-amber-700">{numberFormatter.format(stats.pending)}</span>
            </Link>
            <Link
              href="/reports?status=in_progress"
              className="flex items-start justify-between gap-4 p-4 transition hover:bg-slate-50"
            >
              <span>
                <span className="block text-sm font-medium text-slate-900">Pantau pekerjaan berjalan</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">Periksa laporan yang menunggu penyelesaian.</span>
              </span>
              <span className="shrink-0 text-lg font-semibold tabular-nums text-sky-700">{numberFormatter.format(stats.inProgress)}</span>
            </Link>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs leading-5 text-slate-500">
              Status laporan diubah melalui detail laporan. Gunakan catatan admin untuk memberi konteks kepada pengguna mobile.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
