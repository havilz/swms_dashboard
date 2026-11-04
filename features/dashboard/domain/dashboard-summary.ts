import { isRecord } from "@/features/auth/domain/admin-user";

export type DashboardReport = {
  id: number;
  title: string;
  locationAddress: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  createdAt: string;
  userName: string;
  userEmail: string;
};

export type DashboardSummary = {
  stats: {
    totalReports: number;
    pending: number;
    inProgress: number;
    completed: number;
    totalUsers: number;
  };
  recentReports: DashboardReport[];
};

const reportStatuses = ["pending", "in_progress", "completed", "rejected"] as const;

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isInteger(value) && typeof value === "number" && value >= 0;
}

function parseReport(value: unknown): DashboardReport | null {
  if (!isRecord(value) || !isRecord(value.user)) return null;

  const { id, title, location_address, status, created_at } = value;
  const { name, email } = value.user;
  if (
    typeof id !== "number" ||
    typeof title !== "string" ||
    typeof location_address !== "string" ||
    typeof status !== "string" ||
    !reportStatuses.includes(status as (typeof reportStatuses)[number]) ||
    typeof created_at !== "string" ||
    typeof name !== "string" ||
    typeof email !== "string"
  ) {
    return null;
  }

  return {
    id,
    title,
    locationAddress: location_address,
    status: status as DashboardReport["status"],
    createdAt: created_at,
    userName: name,
    userEmail: email,
  };
}

export function parseDashboardSummary(value: unknown): DashboardSummary | null {
  if (!isRecord(value) || !isRecord(value.data)) return null;
  const { stats, recent_reports: recentReports } = value.data;
  if (!isRecord(stats) || !Array.isArray(recentReports)) return null;

  const {
    total_reports: totalReports,
    pending,
    in_progress: inProgress,
    completed,
    total_users: totalUsers,
  } = stats;
  if (
    !isNonNegativeInteger(totalReports) ||
    !isNonNegativeInteger(pending) ||
    !isNonNegativeInteger(inProgress) ||
    !isNonNegativeInteger(completed) ||
    !isNonNegativeInteger(totalUsers)
  ) {
    return null;
  }

  const parsedReports = recentReports.map(parseReport);
  if (parsedReports.some((report) => report === null)) return null;

  return {
    stats: { totalReports, pending, inProgress, completed, totalUsers },
    recentReports: parsedReports.filter(
      (report): report is DashboardReport => report !== null,
    ),
  };
}
