import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const notificationId = Number(id);

    if (Number.isNaN(notificationId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID notifikasi tidak valid",
        },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Notifikasi ditandai sudah dibaca",
      data: notification,
    });
  } catch (error) {
    console.error("PUT /api/notifications/[id]/read error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui notifikasi",
      },
      { status: 500 }
    );
  }
}