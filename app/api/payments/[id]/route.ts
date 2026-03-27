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
    const paymentId = Number(id);

    if (Number.isNaN(paymentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID pembayaran tidak valid",
        },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
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

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message: "Data pembayaran tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("GET /api/payments/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil detail pembayaran",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const paymentId = Number(id);

    if (Number.isNaN(paymentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID pembayaran tidak valid",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { title, amount, status, method, paidAt, dueDate } = body;

    if (!title || !amount || !dueDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Judul, nominal, dan jatuh tempo wajib diisi",
        },
        { status: 400 }
      );
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        title,
        amount: Number(amount),
        status,
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
      message: "Pembayaran berhasil diperbarui",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("PUT /api/payments/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui pembayaran",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const paymentId = Number(id);

    if (Number.isNaN(paymentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID pembayaran tidak valid",
        },
        { status: 400 }
      );
    }

    await prisma.payment.delete({
      where: { id: paymentId },
    });

    return NextResponse.json({
      success: true,
      message: "Pembayaran berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/payments/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus pembayaran",
      },
      { status: 500 }
    );
  }
}