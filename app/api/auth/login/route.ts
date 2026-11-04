import { NextResponse } from "next/server";
import { isRecord, parseAdminUser } from "@/features/auth/domain/admin-user";
import {
  ADMIN_TOKEN_COOKIE,
  ADMIN_TOKEN_MAX_AGE,
} from "@/features/auth/infrastructure/admin-session";
import {
  BackendApiError,
  BackendConnectionError,
  requestBackend,
} from "@/features/auth/infrastructure/backend-api";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "Format request tidak valid." }, { status: 400 });
    }
    throw error;
  }

  if (
    !isRecord(body) ||
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    body.email.length > 255 ||
    body.password.length === 0 ||
    body.password.length > 255
  ) {
    return NextResponse.json(
      { message: "Email dan password wajib diisi." },
      { status: 422 },
    );
  }

  try {
    const { response, data } = await requestBackend("auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json(
          { message: "Terlalu banyak percobaan. Coba lagi beberapa saat." },
          { status: 429 },
        );
      }
      if (response.status === 401 || response.status === 422) {
        return NextResponse.json(
          { message: "Email atau password tidak valid." },
          { status: 401 },
        );
      }
      if (response.status === 403) {
        return NextResponse.json(
          { message: "Akun ini tidak memiliki akses administrator." },
          { status: 403 },
        );
      }
      return NextResponse.json(
        { message: "Layanan login backend sedang bermasalah." },
        { status: 502 },
      );
    }

    if (!isRecord(data) || !isRecord(data.data)) {
      return NextResponse.json(
        { message: "Response login dari backend tidak valid." },
        { status: 502 },
      );
    }

    const token = data.data.token;
    if (typeof token !== "string" || token.length === 0) {
      return NextResponse.json(
        { message: "Response login dari backend tidak valid." },
        { status: 502 },
      );
    }

    const user = parseAdminUser(data.data.user);
    if (!user) {
      const { response: logoutResponse } = await requestBackend(
        "auth/logout",
        { method: "POST" },
        token,
      );
      if (!logoutResponse.ok && logoutResponse.status !== 401) {
        return NextResponse.json(
          { message: "Akun bukan administrator dan token sementara gagal dicabut." },
          { status: 502 },
        );
      }
      return NextResponse.json(
        { message: "Akun ini tidak memiliki akses administrator." },
        { status: 403 },
      );
    }

    const result = NextResponse.json({ data: { user } });
    result.cookies.set(ADMIN_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_TOKEN_MAX_AGE,
    });
    return result;
  } catch (error) {
    if (error instanceof BackendConnectionError) {
      return NextResponse.json(
        { message: "Backend tidak dapat dihubungi. Periksa koneksi lalu coba lagi." },
        { status: 502 },
      );
    }
    if (error instanceof BackendApiError) {
      return NextResponse.json(
        { message: "Layanan login backend sedang bermasalah." },
        { status: 502 },
      );
    }
    throw error;
  }
}
