import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID user tidak valid",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        nim: true,
        email: true,
        role: true,
        photoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil detail user",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID user tidak valid",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { fullName, email, role, photoUrl } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama lengkap dan email wajib diisi",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: userId,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah digunakan user lain",
        },
        { status: 409 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        email,
        role: role ?? undefined,
        photoUrl: photoUrl ?? null,
      },
      select: {
        id: true,
        fullName: true,
        nim: true,
        email: true,
        role: true,
        photoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil diperbarui",
      data: updatedUser,
    });
  } catch (error) {
    console.error("PUT /api/users/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui user",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID user tidak valid",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User tidak ditemukan",
        },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus user",
      },
      { status: 500 }
    );
  }
}