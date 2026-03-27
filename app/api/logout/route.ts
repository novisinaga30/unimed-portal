import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("auth_token", "", {
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("auth_role", "", {
    maxAge: 0,
    path: "/",
  });

  return response;
}