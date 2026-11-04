import "server-only";

import {
  BackendApiError,
  BackendConnectionError,
  requestBackend,
} from "@/features/auth/infrastructure/backend-api";
import { isRecord } from "@/features/auth/domain/admin-user";
import { parsePagination } from "@/features/reports/domain/admin-report";
import { parseAdminAccount } from "../domain/admin-user";

export async function getAdminUsers(
  token: string,
  filters: { search: string; role: string; page: number },
) {
  const query = new URLSearchParams({ per_page: "15" });
  if (filters.search) query.set("search", filters.search);
  if (filters.role) query.set("role", filters.role);
  if (filters.page > 1) query.set("page", String(filters.page));

  const { response, data } = await requestBackend(`admin/users?${query}`, {}, token);
  if (!response.ok) {
    if (response.status >= 500) throw new BackendConnectionError();
    throw new BackendApiError("Permintaan daftar pengguna ditolak backend.", response.status);
  }
  if (!isRecord(data) || !Array.isArray(data.data)) {
    throw new BackendApiError("Format daftar pengguna dari backend tidak valid.", 502);
  }

  const users = data.data.map(parseAdminAccount);
  const pagination = parsePagination(data.meta);
  if (users.some((user) => user === null) || !pagination) {
    throw new BackendApiError("Data daftar pengguna dari backend tidak lengkap.", 502);
  }
  return {
    users: users.filter((user): user is NonNullable<typeof user> => user !== null),
    pagination,
  };
}
