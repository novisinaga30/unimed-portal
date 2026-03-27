import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.error("GET /api/announcements error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil pengumuman",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, title, description, date } = body;

    if (!category || !title || !description || !date) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua field pengumuman wajib diisi",
        },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        category,
        title,
        description,
        date,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pengumuman berhasil ditambahkan",
      data: announcement,
    });
  } catch (error) {
    console.error("POST /api/announcements error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan pengumuman",
      },
      { status: 500 }
    );
  }
}