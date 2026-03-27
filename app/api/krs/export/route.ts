import { prisma } from "@/lib/prisma";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "User ID wajib diisi",
        },
        { status: 400 }
      );
    }

    const numericUserId = Number(userId);

    if (Number.isNaN(numericUserId)) {
      return Response.json(
        {
          success: false,
          message: "User ID tidak valid",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: numericUserId },
      select: {
        id: true,
        fullName: true,
        nim: true,
        email: true,
      },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const krsItems = await prisma.krs.findMany({
      where: { userId: numericUserId },
      orderBy: {
        id: "asc",
      },
      include: {
        course: true,
      },
    });

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();

    let y = height - 50;

    const drawText = (
      text: string,
      x: number,
      size = 11,
      isBold = false,
      color = rgb(0, 0, 0)
    ) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: isBold ? boldFont : font,
        color,
      });
    };

    const newPageIfNeeded = () => {
      if (y < 80) {
        page = pdfDoc.addPage([595, 842]);
        y = height - 50;
      }
    };

    drawText("KARTU RENCANA STUDI (KRS)", 50, 18, true);
    y -= 30;

    drawText(`Nama: ${user.fullName}`, 50);
    y -= 18;
    drawText(`NIM: ${user.nim}`, 50);
    y -= 18;
    drawText(`Email: ${user.email}`, 50);
    y -= 25;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });

    y -= 20;

    drawText("Kode", 50, 11, true);
    drawText("Mata Kuliah", 120, 11, true);
    drawText("SKS", 430, 11, true);
    drawText("Semester", 480, 11, true);

    y -= 12;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });

    y -= 18;

    let totalSks = 0;

    if (krsItems.length === 0) {
      drawText("Belum ada mata kuliah di KRS.", 50);
      y -= 20;
    } else {
      for (const item of krsItems) {
        newPageIfNeeded();

        drawText(item.course.code, 50);
        drawText(item.course.name, 120);
        drawText(String(item.course.credits), 430);
        drawText(item.semester, 480);

        totalSks += item.course.credits;
        y -= 20;
      }
    }

    y -= 10;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });

    y -= 20;

    drawText(`Total SKS: ${totalSks}`, 50, 12, true);

    const pdfBytes = await pdfDoc.save();

// 🔥 FIX DI SINI
const buffer = Buffer.from(pdfBytes);

return new Response(buffer, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=KRS-${user.nim}.pdf`,
  },
});
  } catch (error) {
    console.error("EXPORT PDF ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal export PDF",
      },
      { status: 500 }
    );
  }
}