import Link from "next/link";
import { StatusBadge } from "@/components/global/ui/status-badge";
import type { AdminReport, Pagination } from "../domain/admin-report";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Waktu tidak tersedia"
    : new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
}

function pageHref(page: number, search: string, status: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/reports?${query}` : "/reports";
}

export function ReportList({
  reports,
  pagination,
  search,
  status,
}: {
  reports: AdminReport[];
  pagination: Pagination;
  search: string;
  status: string;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#cbd8c8] bg-[#f8fbf6]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
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
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 align-top">
                  <p className="font-medium text-slate-900">{report.user.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{report.user.email}</p>
                </td>
                <td className="max-w-sm px-5 py-4 align-top">
                  <p className="truncate font-medium text-slate-900">{report.title}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{report.locationAddress}</p>
                </td>
                <td className="whitespace-nowrap px-5 py-4 align-top"><StatusBadge status={report.status} /></td>
                <td className="whitespace-nowrap px-5 py-4 align-top text-xs text-slate-500">{formatDate(report.createdAt)}</td>
                <td className="px-5 py-4 text-right align-top">
                  <Link href={`/reports/${report.id}`} className="font-medium text-emerald-800 underline underline-offset-4 hover:text-emerald-950">
                    Buka
                  </Link>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                  Tidak ada laporan yang cocok dengan filter ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-500">
          {pagination.total === 0
            ? "Belum ada laporan"
            : `${pagination.total} laporan · halaman ${pagination.currentPage} dari ${pagination.lastPage}`}
        </p>
        <div className="flex gap-2">
          {pagination.currentPage > 1 && (
            <Link href={pageHref(pagination.currentPage - 1, search, status)} className="rounded-lg border border-slate-300 px-3 py-2 hover:bg-white">
              Sebelumnya
            </Link>
          )}
          {pagination.currentPage < pagination.lastPage && (
            <Link href={pageHref(pagination.currentPage + 1, search, status)} className="rounded-lg border border-slate-300 px-3 py-2 hover:bg-white">
              Berikutnya
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
