/*
  Warnings:

  - You are about to drop the `mutation_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mutation_log" DROP CONSTRAINT "mutation_log_by_id_fkey";

-- DropForeignKey
ALTER TABLE "mutation_log" DROP CONSTRAINT "mutation_log_target_beneficiary_id_fkey";

-- DropForeignKey
ALTER TABLE "mutation_log" DROP CONSTRAINT "mutation_log_target_structure_id_fkey";

-- DropForeignKey
ALTER TABLE "mutation_log" DROP CONSTRAINT "mutation_log_target_user_id_fkey";

-- DropTable
DROP TABLE "mutation_log";

-- DropTable
DROP TABLE "verification_token";

-- DropEnum
DROP TYPE "MutationSource";
