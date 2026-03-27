import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/mailer";

export async function GET() {
  try {
    await sendNotificationEmail({
      to: process.env.SMTP_USER || "",
      subject: "Test Email Portal Unimed",
      html: `
        <h2>Test Email Berhasil</h2>
        <p>Kalau email ini masuk, berarti konfigurasi SMTP kamu sudah benar.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Email test berhasil dikirim",
    });
  } catch (error) {
    console.error("TEST EMAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Email test gagal dikirim",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}