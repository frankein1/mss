-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('ToSend', 'Sending', 'Sent', 'Error');

-- CreateTable
CREATE TABLE "email" (
    "id" UUID NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "error" TEXT,
    "status" "EmailStatus" NOT NULL DEFAULT 'ToSend',
    "sentDate" TIMESTAMP(3),
    "retryNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "email_pkey" PRIMARY KEY ("id")
);
