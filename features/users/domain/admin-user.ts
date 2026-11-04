import { isRecord } from "@/features/auth/domain/admin-user";

export type AdminAccount = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "admin" | "user";
  createdAt: string;
};

export function parseAdminAccount(value: unknown): AdminAccount | null {
  if (!isRecord(value)) return null;
  const { id, name, email, phone, role, created_at: createdAt } = value;
  if (
    typeof id !== "number" ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    (phone !== null && typeof phone !== "string") ||
    (role !== "admin" && role !== "user") ||
    typeof createdAt !== "string"
  ) {
    return null;
  }
  return { id, name, email, phone, role, createdAt };
}
