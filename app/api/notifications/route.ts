import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/mailer";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const notifications = await prisma.notification.findMany({
      where: userId
        ? {
            userId: Number(userId),
          }
        : undefined,
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
      },
    });

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil notifikasi",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, title, message, type, sendEmail } = body;

    if (!userId || !title || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "User, judul, dan pesan wajib diisi",
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

    const notification = await prisma.notification.create({
      data: {
        userId: Number(userId),
        title,
        message,
        type: type || "info",
        emailSent: false,
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
      },
    });

    let emailSent = false;
    let emailErrorMessage = "";

    if (sendEmail) {
      try {
        await sendNotificationEmail({
          to: user.email,
          subject: title,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>${title}</h2>
              <p>Halo ${user.fullName},</p>
              <p>${message}</p>
              <p>Salam,<br/>Portal Mahasiswa Unimed</p>
            </div>
          `,
        });

        emailSent = true;

        await prisma.notification.update({
          where: { id: notification.id },
          data: {
            emailSent: true,
          },
        });
      } catch (emailError) {
        console.error("EMAIL SEND ERROR:", emailError);
        emailErrorMessage =
          "Notifikasi tersimpan, tetapi email gagal dikirim. Cek SMTP di file .env.";
      }
    }

    return NextResponse.json({
      success: true,
      message:
        sendEmail && !emailSent
          ? emailErrorMessage
          : "Notifikasi berhasil dikirim",
      data: {
        ...notification,
        emailSent,
      },
    });
  } catch (error) {
    console.error("POST /api/notifications error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengirim notifikasi",
      },
      { status: 500 }
    );
  }
}