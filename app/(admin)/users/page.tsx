import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminSession } from "@/features/auth/infrastructure/admin-session";
import { BackendApiError, BackendConnectionError } from "@/features/auth/infrastructure/backend-api";
import { getAdminUsers } from "@/features/users/infrastructure/users-api";

export const metadata: Metadata = {
  title: "Pengguna | SWMS Admin",
};

type SearchParams = Promise<{
  search?: string;
  role?: string;
  page?: string;
}>;

function pageHref(page: number, search: string, role: string) {
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (role) query.set("role", role);
  if (page > 1) query.set("page", String(page));
  const value = query.toString();
  return value ? `/users?${value}` : "/users";
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Tanggal tidak tersedia"
    : new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default async function UsersPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requireAdminSession();
  const params = await searchParams;
  const search = params.search?.slice(0, 255) ?? "";
  const role = params.role === "user" || params.role === "admin" ? params.role : "";
  const parsedPage = Number(params.page);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 && parsedPage < 1_000_000 ? parsedPage : 1;

  const result = await getAdminUsers(session.token, { search, role, page }).then(
    (data) => ({ kind: "success" as const, data }),
    (error: unknown) => ({ kind: "error" as const, error }),
  );

  if (result.kind === "error") {
    if (!(result.error instanceof BackendConnectionError || result.error instanceof BackendApiError)) {
      throw result.error;
    }

    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900" role="alert">
        <h1 className="font-semibold">Daftar pengguna belum dapat dimuat</h1>
        <p className="mt-1">{result.error.message}</p>
      </div>
    );
  }

  const { users, pagination } = result.data;
  return (
      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium text-emerald-800">Administrasi</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Manajemen pengguna</h1>
          <p className="mt-1 text-sm text-slate-500">Daftar akun yang terdaftar pada sistem SWMS.</p>
        </div>
        <form method="get" className="flex flex-col gap-3 rounded-xl border border-[#cbd8c8] bg-[#f8fbf6] p-4 sm:flex-row">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Cari pengguna</span>
            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Cari nama atau email"
              className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
            />
          </label>
          <label>
            <span className="sr-only">Filter role</span>
            <select name="role" defaultValue={role} className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm sm:w-44">
              <option value="">Semua role</option>
              <option value="user">Pengguna</option>
              <option value="admin">Administrator</option>
            </select>
          </label>
          <button type="submit" className="min-h-10 rounded-lg bg-[#17392d] px-4 text-sm font-semibold text-white hover:bg-[#244c38]">
            Terapkan filter
          </button>
        </form>

        <section className="overflow-hidden rounded-xl border border-[#cbd8c8] bg-[#f8fbf6]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs font-medium text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3">Nama</th>
                  <th scope="col" className="px-5 py-3">Kontak</th>
                  <th scope="col" className="px-5 py-3">Role</th>
                  <th scope="col" className="px-5 py-3">Terdaftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-900">{user.name}</td>
                    <td className="px-5 py-4 text-slate-600">
                      <p>{user.email}</p>
                      {user.phone && <p className="mt-1 text-xs text-slate-500">{user.phone}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.role === "admin" ? "bg-[#e8eee7] text-[#17392d]" : "bg-slate-100 text-slate-700"}`}>
                        {user.role === "admin" ? "Administrator" : "Pengguna"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-sm text-slate-500">Tidak ada pengguna yang cocok dengan filter ini.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500">{pagination.total} akun · halaman {pagination.currentPage} dari {pagination.lastPage}</p>
            <div className="flex gap-2">
              {pagination.currentPage > 1 && <Link href={pageHref(pagination.currentPage - 1, search, role)} className="rounded-lg border border-slate-300 px-3 py-2 hover:bg-white">Sebelumnya</Link>}
              {pagination.currentPage < pagination.lastPage && <Link href={pageHref(pagination.currentPage + 1, search, role)} className="rounded-lg border border-slate-300 px-3 py-2 hover:bg-white">Berikutnya</Link>}
            </div>
          </div>
        </section>
      </div>
  );
}
