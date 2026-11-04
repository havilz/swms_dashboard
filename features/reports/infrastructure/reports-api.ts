import "server-only";

import {
  BackendApiError,
  BackendConnectionError,
  requestBackend,
} from "@/features/auth/infrastructure/backend-api";
import { parseAdminReport, parsePagination, type AdminReport, type Pagination, type ReportStatus } from "../domain/admin-report";
import { isRecord } from "@/features/auth/domain/admin-user";

export type ReportFilters = {
  search?: string;
  status?: ReportStatus;
  page?: number;
};

function queryString(filters: ReportFilters) {
  const query = new URLSearchParams({ per_page: "15" });
  if (filters.search) query.set("search", filters.search);
  if (filters.status) query.set("status", filters.status);
  if (filters.page && filters.page > 1) query.set("page", String(filters.page));
  return query.toString();
}

function assertApiResponse(response: Response) {
  if (!response.ok) {
    if (response.status >= 500) throw new BackendConnectionError();
    throw new BackendApiError("Permintaan laporan ditolak oleh backend.", response.status);
  }
}

export async function getAdminReports(token: string, filters: ReportFilters) {
  const { response, data } = await requestBackend(
    `admin/reports?${queryString(filters)}`,
    {},
    token,
  );
  assertApiResponse(response);

  if (!isRecord(data) || !Array.isArray(data.data)) {
    throw new BackendApiError("Format daftar laporan dari backend tidak valid.", 502);
  }
  const reports = data.data.map(parseAdminReport);
  const pagination = parsePagination(data.meta);
  if (reports.some((report) => report === null) || !pagination) {
    throw new BackendApiError("Data daftar laporan dari backend tidak lengkap.", 502);
  }

  return {
    reports: reports.filter((report): report is AdminReport => report !== null),
    pagination: pagination as Pagination,
  };
}

export async function getAdminReport(token: string, id: number): Promise<AdminReport> {
  const { response, data } = await requestBackend(`admin/reports/${id}`, {}, token);
  assertApiResponse(response);

  if (!isRecord(data)) {
    throw new BackendApiError("Format detail laporan dari backend tidak valid.", 502);
  }
  const report = parseAdminReport(data.data);
  if (!report) throw new BackendApiError("Detail laporan dari backend tidak lengkap.", 502);
  return report;
}
