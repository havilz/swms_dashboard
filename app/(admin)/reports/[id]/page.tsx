import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { StatusBadge } from "@/components/global/ui/status-badge";
import { BackendApiError, BackendConnectionError } from "@/features/auth/infrastructure/backend-api";
import { requireAdminSession } from "@/features/auth/infrastructure/admin-session";
import { getAdminReport } from "@/features/reports/infrastructure/reports-api";
import { ReportStatusForm } from "@/features/reports/components/report-status-form";
import { ReportImagePreview } from "@/features/reports/components/report-image-preview";
import { ReportClassification } from "@/features/reports/components/report-classification";

export const metadata: Metadata = {
  title: "Detail laporan | SWMS Admin",
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Waktu tidak tersedia"
    : new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
}

export default async function ReportDetailPage({ params }: PageProps<"/reports/[id]">) {
  const session = await requireAdminSession();
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const result = await getAdminReport(session.token, Number(id)).then(
    (report) => ({ kind: "success" as const, report }),
    (error: unknown) => ({ kind: "error" as const, error }),
  );

  if (result.kind === "error") {
    if (result.error instanceof BackendApiError && result.error.status === 401) {
      redirect("/login?expired=1");
    }
    if (result.error instanceof BackendApiError && result.error.status === 404) notFound();
    if (!(result.error instanceof BackendConnectionError || result.error instanceof BackendApiError)) {
      throw result.error;
    }

    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900" role="alert">
        <h1 className="font-semibold">Detail laporan belum dapat dimuat</h1>
        <p className="mt-1">{result.error.message}</p>
      </div>
    );
  }

  const { report } = result;
  return (
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link href="/reports" className="text-sm font-medium text-emerald-800 hover:underline">← Kembali ke laporan</Link>
            <p className="mt-4 text-sm text-slate-500">Laporan #{report.id}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{report.title}</h1>
          </div>
          <StatusBadge status={report.status} />
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="space-y-5 rounded-xl border border-[#cbd8c8] bg-[#f8fbf6] p-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Detail laporan</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-slate-500">Lokasi</dt>
                  <dd className="mt-1 text-sm text-slate-800">{report.locationAddress}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Tanggal masuk</dt>
                  <dd className="mt-1 text-sm text-slate-800">{formatDate(report.createdAt)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-slate-500">Deskripsi</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-800">{report.description}</dd>
                </div>
                {report.imageUrl && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-slate-500">Foto laporan</dt>
                    <dd className="mt-2 rounded-xl border border-slate-200 bg-white p-2">
                      <div className="overflow-hidden rounded-lg">
                        <ReportImagePreview
                          src={`/api/admin/reports/${report.id}/image`}
                          alt={`Foto laporan: ${report.title}`}
                        />
                      </div>
                      <ReportClassification reportId={report.id} />
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h2 className="text-sm font-semibold text-slate-900">Informasi pelapor</h2>
              <p className="mt-2 text-sm text-slate-800">{report.user.name}</p>
              <p className="mt-1 text-xs text-slate-500">{report.user.email}</p>
            </div>
          </section>

          <ReportStatusForm
            reportId={report.id}
            status={report.status}
            adminNotes={report.adminNotes}
          />
        </div>
      </div>
  );
}
