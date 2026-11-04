import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReportFilters } from "@/features/reports/components/report-filters";
import { ReportList } from "@/features/reports/components/report-list";
import { reportStatuses, type ReportStatus } from "@/features/reports/domain/admin-report";
import { getAdminReports } from "@/features/reports/infrastructure/reports-api";
import { requireAdminSession } from "@/features/auth/infrastructure/admin-session";
import { BackendApiError, BackendConnectionError } from "@/features/auth/infrastructure/backend-api";

export const metadata: Metadata = {
  title: "Laporan | SWMS Admin",
};

type SearchParams = Promise<{
  search?: string;
  status?: string;
  page?: string;
}>;

function isReportStatus(value: string | undefined): value is ReportStatus {
  return reportStatuses.some((status) => status === value);
}

export default async function ReportsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requireAdminSession();
  const params = await searchParams;
  const search = params.search?.slice(0, 255) ?? "";
  const status = isReportStatus(params.status) ? params.status : "";
  const parsedPage = Number(params.page);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 && parsedPage < 1_000_000 ? parsedPage : 1;

  const result = await getAdminReports(session.token, {
      search,
      status: status || undefined,
      page,
    }).then(
      (data) => ({ kind: "success" as const, data }),
      (error: unknown) => ({ kind: "error" as const, error }),
    );

  if (result.kind === "error") {
    if (result.error instanceof BackendApiError && result.error.status === 401) {
      redirect("/login?expired=1");
    }
    if (!(result.error instanceof BackendConnectionError || result.error instanceof BackendApiError)) {
      throw result.error;
    }

    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900" role="alert">
        <h1 className="font-semibold">Daftar laporan belum dapat dimuat</h1>
        <p className="mt-1">{result.error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-emerald-800">Operasional</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Laporan sampah</h1>
        <p className="mt-1 text-sm text-slate-500">Tinjau laporan dan ikuti progres penanganannya.</p>
      </div>
      <ReportFilters search={search} status={status} />
      <ReportList {...result.data} search={search} status={status} />
    </div>
  );
}
