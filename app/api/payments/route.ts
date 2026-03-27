import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
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
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("GET /api/payments error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data pembayaran",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, title, amount, status, method, paidAt, dueDate } = body;

    if (!userId || !title || !amount || !dueDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Mahasiswa, judul tagihan, nominal, dan jatuh tempo wajib diisi",
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
          message: "Mahasiswa tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        userId: Number(userId),
        title,
        amount: Number(amount),
        status: status || "unpaid",
        method: method || null,
        paidAt: paidAt || null,
        dueDate,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            nim: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tagihan UKT berhasil ditambahkan",
      data: payment,
    });
  } catch (error) {
    console.error("POST /api/payments error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan tagihan UKT",
      },
      { status: 500 }
    );
  }
}