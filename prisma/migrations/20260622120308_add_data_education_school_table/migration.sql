-- CreateEnum
CREATE TYPE "RepClassification" AS ENUM ('Rep', 'RepPlus');

-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('Ecole', 'College', 'Lycee', 'EREA', 'MedicoSocial', 'ServiceAdministratif', 'InformationOrientation', 'Autre');

-- CreateEnum
CREATE TYPE "SchoolStatus" AS ENUM ('OUVERT', 'FERME', 'AFERMER', 'AOUVRIR');

-- AlterTable
ALTER TABLE "beneficiary" ADD COLUMN "school_uai" TEXT;

-- CreateTable
CREATE TABLE "data_education_school" (
    "uai" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SchoolType" NOT NULL,
    "nature" TEXT NOT NULL,
    "address" TEXT,
    "zipcode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "academy" TEXT NOT NULL,
    "status" "SchoolStatus" NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "rep_classification" "RepClassification",
    "qpv_code" TEXT,
    "qpv_name" TEXT,
    "qpv_revised" BOOLEAN NOT NULL DEFAULT false,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "last_imported_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_education_school_pkey" PRIMARY KEY ("uai")
);

-- AddForeignKey
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_school_uai_fkey" FOREIGN KEY ("school_uai") REFERENCES "data_education_school"("uai") ON DELETE SET NULL ON UPDATE CASCADE;
