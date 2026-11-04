import "server-only";

import {
  BackendApiError,
  BackendConnectionError,
  requestBackend,
} from "@/features/auth/infrastructure/backend-api";
import { parseDashboardSummary } from "../domain/dashboard-summary";

export async function getDashboardSummary(token: string) {
  const { response, data } = await requestBackend("admin/dashboard", {}, token);
  if (!response.ok) {
    if (response.status >= 500) throw new BackendConnectionError();
    throw new BackendApiError("Tidak dapat memuat ringkasan dashboard.", response.status);
  }

  const summary = parseDashboardSummary(data);
  if (!summary) {
    throw new BackendApiError("Format ringkasan dashboard dari backend tidak valid.", 502);
  }
  return summary;
}
