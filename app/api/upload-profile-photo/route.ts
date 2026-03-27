import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "File foto wajib dipilih",
        },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format file harus JPG, PNG, atau WEBP",
        },
        { status: 400 }
      );
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran file maksimal 2MB",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "profile");
    await mkdir(uploadDir, { recursive: true });

    const fileExtension = file.name.split(".").pop() || "png";
    const fileName = `profile-${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/profile/${fileName}`;

    return NextResponse.json({
      success: true,
      message: "Foto berhasil diupload",
      data: {
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error("POST /api/upload-profile-photo error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal upload foto profil",
      },
      { status: 500 }
    );
  }
}