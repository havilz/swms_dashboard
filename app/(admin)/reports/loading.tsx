export default function ReportsLoading() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Memuat laporan">
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-[#dce6da]" />
        <div className="h-8 w-56 animate-pulse rounded bg-[#dce6da]" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-[#e8eee7]" />
      </div>
      <div className="h-16 animate-pulse rounded-xl border border-[#d8e0d5] bg-[#f8fbf6]" />
      <div className="h-96 animate-pulse rounded-xl border border-[#d8e0d5] bg-[#f8fbf6]" />
    </div>
  );
}
