-- CreateTable
CREATE TABLE "Academic" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "sks" INTEGER NOT NULL,
    "ips" DOUBLE PRECISION NOT NULL,
    "ipk" DOUBLE PRECISION NOT NULL,
    "krsStatus" TEXT NOT NULL DEFAULT 'belum disetujui',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Academic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Academic" ADD CONSTRAINT "Academic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
