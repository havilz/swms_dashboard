import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_PROFILE_COOKIE,
  ADMIN_TOKEN_COOKIE,
} from "@/features/auth/infrastructure/admin-session";
import {
  BackendApiError,
  BackendConnectionError,
  requestBackend,
} from "@/features/auth/infrastructure/backend-api";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;
  let logoutFailed = false;

  if (token) {
    try {
      const { response } = await requestBackend(
        "auth/logout",
        { method: "POST" },
        token,
      );
      logoutFailed = !response.ok && response.status !== 401;
    } catch (error) {
      if (error instanceof BackendApiError || error instanceof BackendConnectionError) {
        logoutFailed = true;
      } else {
        throw error;
      }
    }
  }

  const result = logoutFailed
    ? NextResponse.json(
        { message: "Sesi lokal ditutup, tetapi backend gagal mengakhiri token." },
        { status: 502 },
      )
    : NextResponse.json({ message: "Logout berhasil." });

  result.cookies.set(ADMIN_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  result.cookies.set(ADMIN_PROFILE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return result;
}
