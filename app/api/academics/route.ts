import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const academics = await prisma.academic.findMany({
      orderBy: { id: "desc" },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            nim: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: academics,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data akademik" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, semester, sks, ips, ipk, krsStatus } = body;

    if (!userId || !semester || !sks || !ips || !ipk) {
      return NextResponse.json(
        { success: false, message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const academic = await prisma.academic.create({
      data: {
        userId: Number(userId),
        semester,
        sks: Number(sks),
        ips: Number(ips),
        ipk: Number(ipk),
        krsStatus: krsStatus || "belum disetujui",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data akademik berhasil ditambahkan",
      data: academic,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan data akademik" },
      { status: 500 }
    );
  }
}