CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CreateEnum
CREATE TYPE "UserActivityType" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'ARCHIVE');

-- CreateTable
CREATE TABLE "user_activity" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "structure_id" UUID,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object" TEXT NOT NULL,
    "object_id" TEXT NOT NULL,
    "activity" "UserActivityType" NOT NULL,

    CONSTRAINT "user_activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "user_activity" (id, user_id, "date", "object", "object_id", "activity") 
    SELECT gen_random_uuid(), created_by_id, created, 'Comment', id, 'CREATE' from comment where created_by_id IS NOT NULL;

INSERT INTO "user_activity" (id, user_id, "date", "object", "object_id", "activity") 
    SELECT gen_random_uuid(), created_by_id, created, 'Beneficiary', id, 'CREATE' FROM beneficiary where created_by_id IS NOT NULL;

INSERT INTO "user_activity" (id, user_id, "date", "object", "object_id", "activity") 
    SELECT gen_random_uuid(), archived_by_id, archived, 'Beneficiary', id, 'ARCHIVE' FROM beneficiary where archived_by_id IS NOT NULL;

INSERT INTO "user_activity" (id, user_id, "date", "object", "object_id", "activity") 
    SELECT gen_random_uuid(), created_by_id, created, 'HelpRequest', id, 'CREATE' FROM help_request where created_by_id IS NOT NULL;

INSERT INTO "user_activity" (id, user_id, "date", "object", "object_id", "activity") 
    SELECT gen_random_uuid(), created_by_id, created, 'Followup', id, 'CREATE' FROM followup where created_by_id IS NOT NULL;

INSERT INTO "user_activity" (id, user_id, "date", "object", "object_id", "activity") 
    SELECT gen_random_uuid(), created_by_id, created, 'Document', "key", 'CREATE' FROM document where created_by_id IS NOT NULL;

UPDATE "user_activity" ua set structure_id = (select u.structure_id from "user" u where u.id = ua.id); 