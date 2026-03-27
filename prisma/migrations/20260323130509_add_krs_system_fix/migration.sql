/*
  Warnings:

  - You are about to drop the column `room` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `schedule` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `KrsItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "KrsItem" DROP CONSTRAINT "KrsItem_courseId_fkey";

-- DropForeignKey
ALTER TABLE "KrsItem" DROP CONSTRAINT "KrsItem_userId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "room",
DROP COLUMN "schedule";

-- DropTable
DROP TABLE "KrsItem";

-- CreateTable
CREATE TABLE "Krs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'diambil',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Krs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Krs_userId_courseId_semester_key" ON "Krs"("userId", "courseId", "semester");

-- AddForeignKey
ALTER TABLE "Krs" ADD CONSTRAINT "Krs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Krs" ADD CONSTRAINT "Krs_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
