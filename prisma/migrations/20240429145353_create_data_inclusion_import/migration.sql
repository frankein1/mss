-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('Created', 'Ongoing', 'Failure', 'Success');

-- CreateTable
CREATE TABLE "data_inclusion_structure" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3),
    "version" TEXT,
    "siret" TEXT,
    "rna" TEXT,
    "is_branch" BOOLEAN NOT NULL,
    "address" TEXT,
    "address_complement" TEXT,
    "city" TEXT,
    "zipcode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "working_hours" TEXT,
    "type" TEXT NOT NULL,
    "topics" TEXT[],

    CONSTRAINT "data_inclusion_structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_result" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'Created',
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "durationInSeconds" DECIMAL(65,30),
    "errors" JSONB,
    "result" JSONB,

    CONSTRAINT "job_result_pkey" PRIMARY KEY ("id")
);
