"use client";

import { useState } from "react";
import {
  parseWasteClassification,
  wasteCategories,
  type WasteClassification,
} from "../domain/admin-report";

function percentage(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "percent", maximumFractionDigits: 1 }).format(value);
}

function getMessage(value: unknown): string | null {
  if (typeof value !== "object" || value === null || !("message" in value)) return null;
  return typeof value.message === "string" ? value.message : null;
}

export function ReportClassification({ reportId }: { reportId: number }) {
  const [classification, setClassification] = useState<WasteClassification | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function classify() {
    setError("");
    setClassification(null);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/reports/${reportId}/classify`, {
        method: "POST",
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        setError(getMessage(result) ?? "Klasifikasi gambar gagal.");
        return;
      }

      const parsed = parseWasteClassification(result);
      if (!parsed) {
        setError("Respons klasifikasi dari server tidak valid.");
        return;
      }
      setClassification(parsed);
    } catch {
      setError("Layanan klasifikasi tidak dapat dihubungi. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4" aria-busy={isLoading}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Saran klasifikasi AI</h3>
          <p className="mt-1 text-xs text-slate-600">Hasil hanya sebagai referensi, bukan kategori atau keputusan otomatis.</p>
        </div>
        <button
          type="button"
          onClick={classify}
          disabled={isLoading}
          className="min-h-10 rounded-lg bg-[#17392d] px-4 text-sm font-semibold text-white hover:bg-[#244c38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:cursor-wait disabled:opacity-60"
        >
          {isLoading ? "Menganalisis..." : classification ? "Analisis ulang" : "Analisis foto"}
        </button>
      </div>
      {isLoading && <p className="mt-3 text-sm text-slate-600" role="status">Sedang memproses foto laporan...</p>}
      {error && <p className="mt-3 text-sm text-rose-800" role="alert">{error}</p>}
      {classification && !isLoading && (
        <div className="mt-4 border-t border-emerald-200 pt-3">
          <p className="text-sm text-slate-800">
            Prediksi: <strong>{classification.predictedClass}</strong>
            <span className="ml-2 text-slate-600">({percentage(classification.confidence)})</span>
          </p>
          <ul className="mt-2 grid gap-1 text-xs text-slate-600 sm:grid-cols-3">
            {wasteCategories.map((category) => (
              <li key={category}>{category}: {percentage(classification.probabilities[category])}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-500">Model {classification.modelVersion}</p>
        </div>
      )}
    </section>
  );
}
