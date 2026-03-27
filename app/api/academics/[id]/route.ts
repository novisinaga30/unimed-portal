import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const updated = await prisma.academic.update({
      where: { id: Number(id) },
      data: {
        semester: body.semester,
        sks: Number(body.sks),
        ips: Number(body.ips),
        ipk: Number(body.ipk),
        krsStatus: body.krsStatus,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data akademik berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Gagal update akademik" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: Context) {
  try {
    const { id } = await context.params;

    await prisma.academic.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Data akademik dihapus",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Gagal hapus akademik" },
      { status: 500 }
    );
  }
}