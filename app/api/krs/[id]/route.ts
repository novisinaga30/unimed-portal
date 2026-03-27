import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const krsId = Number(id);

    if (Number.isNaN(krsId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID KRS tidak valid",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { approval, adminNote } = body;

    if (!approval) {
      return NextResponse.json(
        {
          success: false,
          message: "Approval wajib diisi",
        },
        { status: 400 }
      );
    }

    const existingKrs = await prisma.krs.findUnique({
      where: { id: krsId },
    });

    if (!existingKrs) {
      return NextResponse.json(
        {
          success: false,
          message: "Data KRS tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const updatedKrs = await prisma.krs.update({
      where: { id: krsId },
      data: {
        approval,
        adminNote: adminNote || null,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            nim: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            code: true,
            name: true,
            credits: true,
            lecturer: true,
            semester: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Validasi KRS berhasil diperbarui",
      data: updatedKrs,
    });
  } catch (error) {
    console.error("PUT /api/krs/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui validasi KRS",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const krsId = Number(id);

    if (Number.isNaN(krsId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID KRS tidak valid",
        },
        { status: 400 }
      );
    }

    const existingKrs = await prisma.krs.findUnique({
      where: { id: krsId },
    });

    if (!existingKrs) {
      return NextResponse.json(
        {
          success: false,
          message: "Data KRS tidak ditemukan",
        },
        { status: 404 }
      );
    }

    await prisma.krs.delete({
      where: { id: krsId },
    });

    return NextResponse.json({
      success: true,
      message: "Data KRS berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/krs/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus KRS",
      },
      { status: 500 }
    );
  }
}