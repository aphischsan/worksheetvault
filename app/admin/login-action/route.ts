import { NextResponse } from "next/server";

const ADMIN_COOKIE = "wv_admin";

const redirectWithError = (request: Request, error: string) =>
  NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(error)}`, request.url), 303);

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");

  if (!process.env.ADMIN_PASSWORD) {
    return redirectWithError(request, "missing_env");
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return redirectWithError(request, "invalid");
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(ADMIN_COOKIE, "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
  return response;
}
