import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { requireAdminSession } from "@/features/auth/infrastructure/admin-session";
import {
  BackendApiError,
  BackendConnectionError,
} from "@/features/auth/infrastructure/backend-api";
import { getDashboardSummary } from "@/features/dashboard/infrastructure/dashboard-api";
import type { DashboardSummary } from "@/features/dashboard/domain/dashboard-summary";

export const metadata: Metadata = {
  title: "Dashboard | SWMS Admin",
};

export default async function DashboardPage() {
  const session = await requireAdminSession();
  let summary: DashboardSummary | null = null;
  let errorMessage: string | null = null;
  let isConnectionError = false;

  try {
    summary = await getDashboardSummary(session.token);
  } catch (error) {
    if (error instanceof BackendConnectionError) {
      isConnectionError = true;
      errorMessage = "Backend tidak dapat dihubungi. Periksa koneksi layanan, lalu muat ulang halaman.";
    } else if (error instanceof BackendApiError) {
      if (error.status === 401) redirect("/login?expired=1");
      errorMessage = error.message;
    } else {
      throw error;
    }
  }

  if (errorMessage) {
    return (
      <div
        className={`rounded-xl border p-5 text-sm ${
          isConnectionError
            ? "border-amber-200 bg-amber-50 text-amber-950"
            : "border-rose-200 bg-rose-50 text-rose-900"
        }`}
        role="alert"
      >
        <h2 className="font-semibold">
          {isConnectionError ? "Dashboard belum dapat dimuat" : "Gagal memuat data dashboard"}
        </h2>
        <p className="mt-1">{errorMessage}</p>
      </div>
    );
  }

  if (!summary) throw new Error("Dashboard summary is unexpectedly empty.");
  return <DashboardOverview summary={summary} />;
}
