"use client";

import Image from "next/image";
import { useState } from "react";

export function ReportImagePreview({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-lg bg-slate-50"
      aria-busy={isLoading}
    >
      {isLoading && !hasError && (
        <div
          className="absolute inset-x-0 top-0 z-10 h-1 overflow-hidden bg-emerald-100"
          role="progressbar"
          aria-label="Memuat foto laporan"
        >
          <div className="h-full w-1/3 animate-[report-image-progress_1.2s_ease-in-out_infinite] bg-emerald-700" />
        </div>
      )}
      {hasError ? (
        <p className="px-4 py-12 text-center text-sm text-rose-700" role="alert">
          Foto laporan gagal dimuat. Coba muat ulang halaman.
        </p>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={900}
          unoptimized
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className="max-h-[480px] w-full rounded-lg object-contain"
        />
      )}
      <style jsx>{`
        @keyframes report-image-progress {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(320%);
          }
        }
      `}</style>
    </div>
  );
}
