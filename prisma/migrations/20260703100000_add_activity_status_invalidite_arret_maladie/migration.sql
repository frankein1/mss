-- AlterEnum
-- New values used by the CSP -> activity status transfer (next migration).
-- ADD VALUE must live in its own migration: PostgreSQL forbids using a freshly
-- added enum value in the same transaction that creates it.
ALTER TYPE "BeneficiaryActivityStatus" ADD VALUE 'Invalidite';
ALTER TYPE "BeneficiaryActivityStatus" ADD VALUE 'ArretMaladie';
