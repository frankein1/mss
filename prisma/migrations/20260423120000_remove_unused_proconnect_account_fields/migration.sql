-- AlterTable
ALTER TABLE "public"."account" DROP COLUMN "type",
DROP COLUMN "refresh_token",
DROP COLUMN "access_token",
DROP COLUMN "expires_at",
DROP COLUMN "token_type",
DROP COLUMN "scope";
