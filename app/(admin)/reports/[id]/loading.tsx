export default function ReportDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-5" aria-busy="true" aria-label="Memuat detail laporan">
      <div className="h-5 w-36 animate-pulse rounded bg-[#dce6da]" />
      <div className="h-9 w-72 max-w-full animate-pulse rounded bg-[#dce6da]" />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="h-[30rem] animate-pulse rounded-xl border border-[#d8e0d5] bg-[#f8fbf6]" />
        <div className="h-72 animate-pulse rounded-xl border border-[#d8e0d5] bg-[#f8fbf6]" />
      </div>
    </div>
  );
}
