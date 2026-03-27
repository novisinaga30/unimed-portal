-- AlterTable
ALTER TABLE "Krs" ADD COLUMN     "adminNote" TEXT,
ADD COLUMN     "approval" TEXT NOT NULL DEFAULT 'pending';
