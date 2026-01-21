-- AlterTable
ALTER TABLE "public"."social_support" ADD COLUMN     "minister_id" UUID;

-- CreateTable
CREATE TABLE "public"."minister" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "function" TEXT NOT NULL,
    "ministry" TEXT,
    "government" TEXT,
    "former" BOOLEAN NOT NULL DEFAULT false,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "minister_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."social_support" ADD CONSTRAINT "social_support_minister_id_fkey" FOREIGN KEY ("minister_id") REFERENCES "public"."minister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:
  - A unique constraint covering the columns `[first_name,last_name,government]` on the table `minister` will be added. If there are existing duplicate values, this will fail.
*/

-- CreateIndex
CREATE UNIQUE INDEX "minister_first_name_last_name_government_key" ON "public"."minister"("first_name", "last_name", "government");
