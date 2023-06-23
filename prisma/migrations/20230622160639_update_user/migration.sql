-- AlterTable
ALTER TABLE "user" ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "access_token_validity" TIMESTAMP(3);
