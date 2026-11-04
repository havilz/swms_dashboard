import "server-only";

export class BackendApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "BackendApiError";
  }
}

export class BackendConnectionError extends Error {
  constructor() {
    super("Backend API tidak dapat dijangkau.");
    this.name = "BackendConnectionError";
  }
}

function getApiUrl(path: string): string {
  const baseUrl = process.env.SWMS_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("SWMS_API_BASE_URL belum dikonfigurasi.");
  }

  const parsedUrl = new URL(baseUrl);
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("SWMS_API_BASE_URL harus menggunakan HTTP atau HTTPS.");
  }

  return `${parsedUrl.toString().replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

export async function requestBackend(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<{ response: Response; data: unknown }> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(getApiUrl(path), {
      ...options,
      headers,
      cache: "no-store",
      redirect: "manual",
    });
  } catch (error) {
    if (error instanceof TypeError) throw new BackendConnectionError();
    throw error;
  }

  let data: unknown = null;
  if (response.headers.get("content-type")?.includes("application/json")) {
    try {
      data = await response.json();
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new BackendApiError("Backend mengirim response JSON yang tidak valid.", 502);
      }
      throw error;
    }
  }

  return { response, data };
}
