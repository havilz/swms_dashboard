"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ReportStatus } from "../domain/admin-report";

const labels: Record<ReportStatus, string> = {
  pending: "Menunggu verifikasi",
  in_progress: "Sedang diproses",
  completed: "Selesai",
  rejected: "Ditolak",
};

function allowedStatuses(status: ReportStatus): ReportStatus[] {
  switch (status) {
    case "pending":
      return ["pending", "in_progress", "rejected"];
    case "in_progress":
      return ["in_progress", "completed", "rejected"];
    case "completed":
    case "rejected":
      return [status];
  }
}

export function ReportStatusForm({
  reportId,
  status,
  adminNotes,
}: {
  reportId: number;
  status: ReportStatus;
  adminNotes: string | null;
}) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState<ReportStatus>(status);
  const [notes, setNotes] = useState(adminNotes ?? "");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/reports/${reportId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, admin_notes: notes }),
      });
      const result: unknown = await response.json();
      const responseText =
        typeof result === "object" &&
        result !== null &&
        "message" in result &&
        typeof result.message === "string"
          ? result.message
          : "";

      if (!response.ok) {
        setError(responseText || "Status laporan gagal diperbarui.");
        return;
      }

      setMessage(responseText || "Perubahan tersimpan.");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi backend. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-[#cbd8c8] bg-[#f8fbf6] p-5">
      <h2 className="font-semibold text-slate-900">Tindak lanjut admin</h2>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Status laporan</span>
        <select
          value={nextStatus}
          onChange={(event) => setNextStatus(event.target.value as ReportStatus)}
          className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
        >
          {allowedStatuses(status).map((item) => <option key={item} value={item}>{labels[item]}</option>)}
        </select>
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Catatan untuk pengguna</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
          maxLength={5000}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          placeholder="Tambahkan konteks atau alasan penolakan"
        />
      </label>
      {error && <p className="text-sm text-rose-800" role="alert">{error}</p>}
      {message && <p className="text-sm text-emerald-800" role="status">{message}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-10 rounded-lg bg-[#17392d] px-4 text-sm font-semibold text-white hover:bg-[#244c38] disabled:opacity-60"
      >
        {isSubmitting ? "Menyimpan..." : "Simpan perubahan"}
      </button>
    </form>
  );
}
