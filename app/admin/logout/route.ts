import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  clearAdminSession();
  return NextResponse.redirect(new URL("/", request.url));
}
