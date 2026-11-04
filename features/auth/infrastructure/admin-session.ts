import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseAdminUser } from "../domain/admin-user";

export const ADMIN_TOKEN_COOKIE = "swms_admin_token";
export const ADMIN_PROFILE_COOKIE = "swms_admin_profile";
export const ADMIN_TOKEN_MAX_AGE = 60 * 60 * 8;

export type AdminSession = {
  token: string;
  user: NonNullable<ReturnType<typeof parseAdminUser>>;
};

function signProfile(token: string, encodedProfile: string) {
  return createHmac("sha256", token)
    .update("swms-admin-profile:v1:")
    .update(encodedProfile)
    .digest("base64url");
}

export function createAdminProfileCookie(token: string, user: AdminSession["user"]) {
  const encodedProfile = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${encodedProfile}.${signProfile(token, encodedProfile)}`;
}

function parseAdminProfile(token: string, value: string | undefined) {
  if (!value) return null;
  const separator = value.lastIndexOf(".");
  if (separator <= 0) return null;

  const encodedProfile = value.slice(0, separator);
  const providedSignature = Buffer.from(value.slice(separator + 1), "base64url");
  const expectedSignature = Buffer.from(signProfile(token, encodedProfile), "base64url");
  if (
    providedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(providedSignature, expectedSignature)
  ) {
    return null;
  }

  try {
    const profile = JSON.parse(Buffer.from(encodedProfile, "base64url").toString("utf8"));
    return parseAdminUser(profile);
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) return null;

  const user = parseAdminProfile(token, cookieStore.get(ADMIN_PROFILE_COOKIE)?.value);
  return user ? { token, user } : null;
});

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/login?expired=1");
  return session;
}
