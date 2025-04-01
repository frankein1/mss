-- AlterTable
ALTER TABLE "user" ADD COLUMN     "authorization_code" TEXT,
ADD COLUMN     "authorization_code_validity" TIMESTAMP(3);
