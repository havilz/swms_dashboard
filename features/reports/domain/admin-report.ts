import { isRecord } from "@/features/auth/domain/admin-user";

export const reportStatuses = ["pending", "in_progress", "completed", "rejected"] as const;
export type ReportStatus = (typeof reportStatuses)[number];

export type AdminReport = {
  id: number;
  title: string;
  description: string;
  locationAddress: string;
  latitude: string | null;
  longitude: string | null;
  imageUrl: string | null;
  status: ReportStatus;
  adminNotes: string | null;
  createdAt: string;
  user: { id: number; name: string; email: string };
};

export type Pagination = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

function isReportStatus(value: unknown): value is ReportStatus {
  return typeof value === "string" && reportStatuses.some((status) => status === value);
}

export function parseAdminReport(value: unknown): AdminReport | null {
  if (!isRecord(value) || !isRecord(value.user)) return null;

  const { id, title, description, location_address, latitude, longitude, image_url, status, admin_notes, created_at } = value;
  const { id: userId, name, email } = value.user;
  if (
    typeof id !== "number" ||
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof location_address !== "string" ||
    (latitude !== null && typeof latitude !== "string") ||
    (longitude !== null && typeof longitude !== "string") ||
    (image_url !== null && typeof image_url !== "string") ||
    !isReportStatus(status) ||
    (admin_notes !== null && typeof admin_notes !== "string") ||
    typeof created_at !== "string" ||
    typeof userId !== "number" ||
    typeof name !== "string" ||
    typeof email !== "string"
  ) {
    return null;
  }

  return {
    id,
    title,
    description,
    locationAddress: location_address,
    latitude,
    longitude,
    imageUrl: image_url,
    status,
    adminNotes: admin_notes,
    createdAt: created_at,
    user: { id: userId, name, email },
  };
}

export function parsePagination(value: unknown): Pagination | null {
  if (!isRecord(value)) return null;
  const { current_page: currentPage, last_page: lastPage, per_page: perPage, total } = value;
  if (
    ![currentPage, lastPage, perPage, total].every(
      (field) => typeof field === "number" && Number.isInteger(field) && field >= 0,
    )
  ) {
    return null;
  }
  return {
    currentPage: currentPage as number,
    lastPage: lastPage as number,
    perPage: perPage as number,
    total: total as number,
  };
}
