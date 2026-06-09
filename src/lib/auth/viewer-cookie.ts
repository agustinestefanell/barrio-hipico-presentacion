import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const VIEWER_COOKIE_NAME = "bh_viewer_access";

export type ViewerCookiePayload = {
  accessTokenId: string;
  slug: string;
  expiry: number;
};

function getSecret() {
  const secret = process.env.ACCESS_COOKIE_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ACCESS_COOKIE_SECRET debe tener al menos 32 caracteres.");
  }
  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createViewerCookieValue(payload: ViewerCookiePayload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyViewerCookieValue(value?: string) {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;

  try {
    const expected = Buffer.from(sign(encoded), "base64url");
    const received = Buffer.from(signature, "base64url");
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as ViewerCookiePayload;
    if (!payload.accessTokenId || !payload.slug || payload.expiry <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setViewerCookie(payload: ViewerCookiePayload) {
  const cookieStore = await cookies();
  const maxAge = Math.max(0, Math.floor((payload.expiry - Date.now()) / 1000));
  cookieStore.set(VIEWER_COOKIE_NAME, createViewerCookieValue(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function getViewerCookie() {
  const cookieStore = await cookies();
  return verifyViewerCookieValue(cookieStore.get(VIEWER_COOKIE_NAME)?.value);
}

export async function clearViewerCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(VIEWER_COOKIE_NAME);
}
