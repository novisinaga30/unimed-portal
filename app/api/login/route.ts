import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "Email/NIM dan password wajib diisi" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { nim: identifier }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Akun tidak ditemukan" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Password salah" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        fullName: user.fullName,
        nim: user.nim,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl,
      },
    });

    response.cookies.set("auth_token", String(user.id), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    response.cookies.set("auth_role", user.role, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("POST /api/login error:", error);

    return NextResponse.json(
      { success: false, message: "Login gagal" },
      { status: 500 }
    );
  }
}