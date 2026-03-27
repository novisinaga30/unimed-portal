import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const krsItems = await prisma.krs.findMany({
      orderBy: {
        id: "desc",
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
      data: krsItems,
    });
  } catch (error) {
    console.error("GET /api/krs error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data KRS",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, courseId, semester } = body;

    if (!userId || !courseId || !semester) {
      return NextResponse.json(
        {
          success: false,
          message: "User, mata kuliah, dan semester wajib diisi",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
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

    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Mata kuliah tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const existingKrs = await prisma.krs.findFirst({
      where: {
        userId: Number(userId),
        courseId: Number(courseId),
        semester,
      },
    });

    if (existingKrs) {
      return NextResponse.json(
        {
          success: false,
          message: "Mata kuliah sudah diambil pada semester ini",
        },
        { status: 409 }
      );
    }

    const krsItem = await prisma.krs.create({
      data: {
        userId: Number(userId),
        courseId: Number(courseId),
        semester,
        status: "diambil",
        approval: "pending",
        adminNote: null,
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
      message: "Mata kuliah berhasil ditambahkan ke KRS",
      data: krsItem,
    });
  } catch (error) {
    console.error("POST /api/krs error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menyimpan KRS",
      },
      { status: 500 }
    );
  }
}