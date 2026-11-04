export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "admin";
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseAdminUser(value: unknown): AdminUser | null {
  if (!isRecord(value)) return null;

  const { id, name, email, role } = value;
  if (
    typeof id !== "number" ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    role !== "admin"
  ) {
    return null;
  }

  return { id, name, email, role };
}
