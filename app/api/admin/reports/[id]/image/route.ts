import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/features/auth/infrastructure/admin-session";
import {
  BackendApiError,
  BackendConnectionError,
} from "@/features/auth/infrastructure/backend-api";
import { getAdminReport } from "@/features/reports/infrastructure/reports-api";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

let r2Client: S3Client | undefined;

function getImageKey(imageUrl: string, publicBaseUrl: string): string | null {
  const image = new URL(imageUrl);
  const publicBase = new URL(publicBaseUrl);
  const prefix = `${publicBase.pathname.replace(/\/+$/, "")}/reports/`;

  if (
    image.origin !== publicBase.origin ||
    !image.pathname.startsWith(prefix)
  ) {
    return null;
  }

  const key = decodeURIComponent(image.pathname.slice(1));
  return key.startsWith("reports/") && !key.split("/").includes("..")
    ? key
    : null;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Sesi admin tidak ditemukan." }, { status: 401 });
  }

  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ message: "Laporan tidak ditemukan." }, { status: 404 });
  }

  let report;
  try {
    report = await getAdminReport(session.token, Number(id));
  } catch (error) {
    if (error instanceof BackendApiError) {
      const status = [401, 403, 404].includes(error.status) ? error.status : 502;
      return NextResponse.json({ message: error.message }, { status });
    }
    if (error instanceof BackendConnectionError) {
      return NextResponse.json({ message: error.message }, { status: 502 });
    }
    throw error;
  }

  if (!report.imageUrl) {
    return NextResponse.json({ message: "Laporan tidak memiliki foto." }, { status: 404 });
  }

  const publicBaseUrl = process.env.R2_PUBLIC_URL;
  const endpoint = process.env.R2_ENDPOINT || process.env.AWS_ENDPOINT;
  const bucket = process.env.R2_BUCKET_NAME || process.env.AWS_BUCKET;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

  if (!publicBaseUrl || !endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    console.error("R2 image proxy is missing server-side configuration.");
    return NextResponse.json(
      { message: "Penyimpanan gambar belum dikonfigurasi." },
      { status: 503 },
    );
  }

  let key: string | null;
  try {
    key = getImageKey(report.imageUrl, publicBaseUrl);
  } catch (error) {
    if (error instanceof TypeError || error instanceof URIError) {
      return NextResponse.json({ message: "URL foto laporan tidak valid." }, { status: 502 });
    }
    throw error;
  }
  if (!key) {
    return NextResponse.json({ message: "URL foto laporan tidak diizinkan." }, { status: 502 });
  }

  try {
    r2Client ??= new S3Client({
      region: "auto",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
    const object = await r2Client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    if (!object.Body) {
      return NextResponse.json({ message: "Foto laporan kosong." }, { status: 502 });
    }

    const contentType = object.ContentType?.split(";")[0].trim().toLowerCase();
    if (!contentType || !["image/jpeg", "image/png", "image/webp"].includes(contentType)) {
      return NextResponse.json({ message: "Format foto laporan tidak didukung." }, { status: 415 });
    }

    return new NextResponse(object.Body.transformToWebStream(), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        ...(object.ContentLength ? { "Content-Length": String(object.ContentLength) } : {}),
      },
    });
  } catch (error) {
    console.error("Failed to load report image from R2.", {
      reportId: Number(id),
      error,
    });
    return NextResponse.json(
      { message: "Foto laporan gagal dimuat." },
      { status: 502 },
    );
  }
}
