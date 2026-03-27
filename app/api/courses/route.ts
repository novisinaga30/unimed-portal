import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("GET /api/courses error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data mata kuliah",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
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

    const existingCourse = await prisma.course.findUnique({
      where: {
        code,
      },
    });

    if (existingCourse) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode mata kuliah sudah terdaftar",
        },
        { status: 409 }
      );
    }

    const course = await prisma.course.create({
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
      message: "Mata kuliah berhasil ditambahkan",
      data: course,
    });
  } catch (error) {
    console.error("POST /api/courses error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan mata kuliah",
      },
      { status: 500 }
    );
  }
}