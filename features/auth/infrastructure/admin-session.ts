import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseAdminUser } from "../domain/admin-user";
import {
  BackendApiError,
  requestBackend,
} from "./backend-api";

export const ADMIN_TOKEN_COOKIE = "swms_admin_token";
export const ADMIN_TOKEN_MAX_AGE = 60 * 60 * 8;

export type AdminSession = {
  token: string;
  user: NonNullable<ReturnType<typeof parseAdminUser>>;
};

export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    const { response, data } = await requestBackend("auth/me", {}, token);
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) return null;
      throw new BackendApiError("Gagal memverifikasi sesi admin.", response.status);
    }

    if (
      typeof data !== "object" ||
      data === null ||
      !("data" in data)
    ) {
      throw new BackendApiError("Format sesi dari backend tidak valid.", 502);
    }

    const user = parseAdminUser(data.data);
    return user ? { token, user } : null;
  } catch (error) {
    if (error instanceof BackendApiError && (error.status === 401 || error.status === 403)) {
      return null;
    }
    throw error;
  }
});

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/login?expired=1");
  return session;
}
