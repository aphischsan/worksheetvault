import { NextResponse } from "next/server";
import { clearStudentSession } from "@/lib/auth";

export async function GET(request: Request) {
  clearStudentSession();
  return NextResponse.redirect(new URL("/", request.url));
}
