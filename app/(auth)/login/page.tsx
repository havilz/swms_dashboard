import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login Administrator - SWMS",
};

function LoginFormFallback() {
  return <div className="h-52 animate-pulse rounded-lg bg-slate-100" aria-label="Memuat formulir login" />;
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-[#e8eee7] lg:grid-cols-[minmax(280px,0.8fr)_minmax(460px,1.2fr)]">
      <section
        className="relative flex min-h-[290px] flex-col justify-between overflow-hidden bg-[#17392d] px-6 py-7 text-[#eef4eb] sm:px-10 lg:min-h-screen lg:px-14 lg:py-12"
        aria-labelledby="brand-title"
      >
        <div className="relative z-10 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c3d8b9] text-sm font-bold tracking-tight text-[#17392d]">SW</span>
          <div>
            <p className="text-base font-bold tracking-tight">SWMS</p>
            <p className="text-xs text-[#b8cdb7]">Smart Waste Admin</p>
          </div>
        </div>

        <div className="relative z-10 mt-14 max-w-md lg:mt-0">
          <p className="mb-5 text-sm font-medium text-[#b8d4b6]">Ruang kendali laporan warga</p>
          <h1 id="brand-title" className="max-w-sm text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#f3f7f0] sm:text-5xl">
            Jaga kota tetap bersih, satu laporan pada satu waktu.
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-[#c4d5c3]">
            Tinjau laporan, pantau pekerjaan petugas, dan berikan pembaruan yang jelas kepada warga.
          </p>
        </div>

        <div className="relative z-10 mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-[#547062] pt-4 text-xs text-[#c4d5c3] lg:mt-0">
          <div>
            <span className="block text-[#f3f7f0]">Laporan</span>
            <span className="mt-1 block">Masuk dan ditinjau</span>
          </div>
          <div>
            <span className="block text-[#f3f7f0]">Status</span>
            <span className="mt-1 block">Terlihat jelas</span>
          </div>
          <div>
            <span className="block text-[#f3f7f0]">Tindakan</span>
            <span className="mt-1 block">Terarah dan tercatat</span>
          </div>
        </div>
      </section>

      <section
        className="flex items-center justify-center bg-[#e8eee7] px-5 py-10 sm:px-10 lg:px-16"
        aria-labelledby="login-title"
      >
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-medium text-[#437052]">Portal administrator</p>
            <h2 id="login-title" className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#17392d]">
              Masuk ke dashboard
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Gunakan akun administrator untuk mengelola laporan sampah.
            </p>
          </div>
          <div className="rounded-2xl border border-[#cbd8c8] bg-[#f8fbf6] p-6 sm:p-8">
            <Suspense fallback={<LoginFormFallback />}>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">Akses ini hanya untuk administrator SWMS.</p>
        </div>
      </section>
    </main>
  );
}
