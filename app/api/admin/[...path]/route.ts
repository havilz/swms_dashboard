import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/features/auth/infrastructure/admin-session";
import {
  BackendConnectionError,
  requestBackend,
} from "@/features/auth/infrastructure/backend-api";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const allowedMethods = new Set(["GET", "POST", "PATCH", "DELETE"]);

function isAllowedAdminPath(path: string[], method: string): boolean {
  if (path.length === 1 && path[0] === "dashboard") return true;
  if (path[0] === "reports") {
    return (
      path.length === 1 ||
      (path.length === 2 && /^\d+$/.test(path[1])) ||
      (path.length === 3 &&
        /^\d+$/.test(path[1]) &&
        (path[2] === "status" || (path[2] === "classify" && method === "POST")))
    );
  }
  if (path[0] === "users") {
    return (
      path.length === 1 ||
      (path.length === 2 && /^\d+$/.test(path[1]))
    );
  }
  return false;
}

async function proxyAdminRequest(request: Request, context: RouteContext) {
  if (!allowedMethods.has(request.method)) {
    return NextResponse.json({ message: "Method tidak didukung." }, { status: 405 });
  }

  const { path } = await context.params;
  if (!isAllowedAdminPath(path, request.method)) {
    return NextResponse.json({ message: "Endpoint admin tidak ditemukan." }, { status: 404 });
  }

  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Sesi admin tidak ditemukan." }, { status: 401 });
  }

  const query = new URL(request.url).searchParams.toString();
  const apiPath = `admin/${path.map(encodeURIComponent).join("/")}${query ? `?${query}` : ""}`;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    headers.set("Content-Type", "application/json");
  }

  let body: string | undefined;
  if (request.method === "POST" || request.method === "PATCH") {
    const rawBody = await request.text();
    if (rawBody.length > 1_000_000) {
      return NextResponse.json({ message: "Ukuran request terlalu besar." }, { status: 413 });
    }
    if (rawBody && !contentType?.includes("application/json")) {
      return NextResponse.json({ message: "Request harus menggunakan JSON." }, { status: 415 });
    }
    body = rawBody || undefined;
  }

  try {
    const { response, data } = await requestBackend(
      apiPath,
      { method: request.method, headers, body },
      token,
    );

    if (response.status >= 500) {
      return NextResponse.json(
        { message: "Backend gagal memproses permintaan." },
        { status: 502 },
      );
    }
    return NextResponse.json(data, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof BackendConnectionError) {
      return NextResponse.json(
        { message: "Backend tidak dapat dihubungi. Coba lagi nanti." },
        { status: 502 },
      );
    }
    throw error;
  }
}

export const GET = proxyAdminRequest;
export const POST = proxyAdminRequest;
export const PATCH = proxyAdminRequest;
export const DELETE = proxyAdminRequest;
