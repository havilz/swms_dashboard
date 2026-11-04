import type { ReactNode } from "react";
import { AdminShell } from "@/components/global/layout/admin-shell";
import { requireAdminSession } from "@/features/auth/infrastructure/admin-session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();
  return <AdminShell user={session.user}>{children}</AdminShell>;
}
