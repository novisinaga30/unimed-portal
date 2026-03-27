import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/mailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email wajib diisi" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Jika email terdaftar, link reset akan dikirim",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const appBaseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
    const resetLink = `${appBaseUrl}/reset-password?token=${token}`;

    try {
      await sendNotificationEmail({
        to: user.email,
        subject: "Reset Password Portal Unimed",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Reset Password</h2>
            <p>Halo ${user.fullName},</p>
            <p>Klik link berikut untuk reset password:</p>
            <p>
              <a href="${resetLink}">${resetLink}</a>
            </p>
            <p>Link berlaku 15 menit.</p>
            <p>Salam,<br/>Portal Mahasiswa Unimed</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("EMAIL SEND ERROR:", mailError);

      return NextResponse.json(
        {
          success: false,
          message:
            "Token reset berhasil dibuat, tapi email gagal dikirim. Cek konfigurasi SMTP di .env",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Link reset password telah dikirim ke email",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Gagal request reset password" },
      { status: 500 }
    );
  }
}