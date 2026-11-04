import { isRecord } from "@/features/auth/domain/admin-user";

export const reportStatuses = ["pending", "in_progress", "completed", "rejected"] as const;
export type ReportStatus = (typeof reportStatuses)[number];
export const wasteCategories = ["Organic Waste", "Plastic Waste", "Paper Waste"] as const;
export type WasteCategory = (typeof wasteCategories)[number];

export type WasteClassification = {
  predictedClass: WasteCategory;
  confidence: number;
  probabilities: Record<WasteCategory, number>;
  modelVersion: string;
};

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

function isWasteCategory(value: unknown): value is WasteCategory {
  return typeof value === "string" && wasteCategories.some((category) => category === value);
}

function parseCoordinate(value: unknown, minimum: number, maximum: number): string | null | undefined {
  if (value === null) return null;
  if ((typeof value !== "string" && typeof value !== "number") || (typeof value === "string" && value.trim() === "")) {
    return undefined;
  }

  const coordinate = Number(value);
  if (!Number.isFinite(coordinate) || coordinate < minimum || coordinate > maximum) {
    return undefined;
  }
  return String(coordinate);
}

export function parseAdminReport(value: unknown): AdminReport | null {
  if (!isRecord(value) || !isRecord(value.user)) return null;

  const { id, title, description, location_address, latitude, longitude, image_url, status, admin_notes, created_at } = value;
  const parsedLatitude = parseCoordinate(latitude, -90, 90);
  const parsedLongitude = parseCoordinate(longitude, -180, 180);
  const { id: userId, name, email } = value.user;
  if (
    typeof id !== "number" ||
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof location_address !== "string" ||
    parsedLatitude === undefined ||
    parsedLongitude === undefined ||
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
    latitude: parsedLatitude,
    longitude: parsedLongitude,
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

export function parseWasteClassification(value: unknown): WasteClassification | null {
  if (!isRecord(value) || !isRecord(value.probabilities)) return null;

  const { predicted_class: predictedClass, confidence, model_version: modelVersion } = value;
  if (
    !isWasteCategory(predictedClass) ||
    typeof confidence !== "number" ||
    !Number.isFinite(confidence) ||
    confidence < 0 ||
    confidence > 1 ||
    typeof modelVersion !== "string" ||
    modelVersion.length === 0 ||
    modelVersion.length > 100 ||
    Object.keys(value.probabilities).length !== wasteCategories.length
  ) {
    return null;
  }

  const probabilities = {} as Record<WasteCategory, number>;
  for (const category of wasteCategories) {
    const probability = value.probabilities[category];
    if (
      typeof probability !== "number" ||
      !Number.isFinite(probability) ||
      probability < 0 ||
      probability > 1
    ) {
      return null;
    }
    probabilities[category] = probability;
  }
  if (Math.abs(Object.values(probabilities).reduce((sum, probability) => sum + probability, 0) - 1) > 0.01) {
    return null;
  }

  return {
    predictedClass,
    confidence,
    probabilities,
    modelVersion,
  };
}
