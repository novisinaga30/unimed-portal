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
    const courseId = Number(id);

    if (Number.isNaN(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID mata kuliah tidak valid",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { code, name, credits, lecturer, semester } = body;

    if (!code || !name || !credits || !lecturer || !semester) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua field mata kuliah wajib diisi",
        },
        { status: 400 }
      );
    }

    const existingCourse = await prisma.course.findFirst({
      where: {
        code,
        NOT: {
          id: courseId,
        },
      },
    });

    if (existingCourse) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode mata kuliah sudah digunakan",
        },
        { status: 409 }
      );
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        code,
        name,
        credits: Number(credits),
        lecturer,
        semester,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mata kuliah berhasil diperbarui",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("PUT /api/courses/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui mata kuliah",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const courseId = Number(id);

    if (Number.isNaN(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID mata kuliah tidak valid",
        },
        { status: 400 }
      );
    }

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mata kuliah berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/courses/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus mata kuliah",
      },
      { status: 500 }
    );
  }
}