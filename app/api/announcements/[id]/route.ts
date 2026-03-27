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
    const announcementId = Number(id);

    if (Number.isNaN(announcementId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID pengumuman tidak valid",
        },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
    });

    if (!announcement) {
      return NextResponse.json(
        {
          success: false,
          message: "Pengumuman tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    console.error("GET /api/announcements/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil detail pengumuman",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const announcementId = Number(id);

    if (Number.isNaN(announcementId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID pengumuman tidak valid",
        },
        { status: 400 }
      );
    }

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

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id: announcementId },
      data: {
        category,
        title,
        description,
        date,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pengumuman berhasil diperbarui",
      data: updatedAnnouncement,
    });
  } catch (error) {
    console.error("PUT /api/announcements/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui pengumuman",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const announcementId = Number(id);

    if (Number.isNaN(announcementId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID pengumuman tidak valid",
        },
        { status: 400 }
      );
    }

    await prisma.announcement.delete({
      where: { id: announcementId },
    });

    return NextResponse.json({
      success: true,
      message: "Pengumuman berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/announcements/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus pengumuman",
      },
      { status: 500 }
    );
  }
}