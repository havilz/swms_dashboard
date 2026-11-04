export default function AdminLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Memuat halaman">
      <div className="h-28 animate-pulse rounded-xl bg-[#e8eee7]" />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-xl border border-[#d8e0d5] bg-[#f8fbf6]" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-xl border border-[#d8e0d5] bg-[#f8fbf6]" />
    </div>
  );
}
