"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function responseMessage(value: unknown): string | null {
  if (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  ) {
    return value.message;
  }
  return null;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let result: unknown;
      try {
        result = await response.json();
      } catch {
        setError("Server mengirim respons yang tidak dapat dibaca.");
        return;
      }

      if (!response.ok) {
        setError(responseMessage(result) ?? "Login gagal. Periksa kembali email dan password.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const sessionExpired = searchParams.get("expired") === "1";

  return (
    <form onSubmit={submit} className="space-y-5">
      {sessionExpired && (
        <p className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
          Sesi berakhir atau tidak memiliki akses admin. Silakan masuk kembali.
        </p>
      )}
      {error && (
        <p className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900" role="alert">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#244333]">Email administrator</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={255}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-lg border border-[#b9cbb8] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#437052] focus:ring-2 focus:ring-[#437052]/20"
          placeholder="admin@swms.test"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#244333]">Kata sandi</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={255}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-lg border border-[#b9cbb8] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#437052] focus:ring-2 focus:ring-[#437052]/20"
          placeholder="Masukkan kata sandi"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex min-h-11 w-full items-center justify-center rounded-lg bg-[#244c38] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#17392d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17392d] disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting ? "Memeriksa..." : "Masuk ke dashboard"}
      </button>
    </form>
  );
}
