-- AlterTable
ALTER TABLE "_document_to_social_support" ADD CONSTRAINT "_document_to_social_support_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_document_to_social_support_AB_unique";

-- AlterTable
ALTER TABLE "_family_file_referents" ADD CONSTRAINT "_family_file_referents_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_family_file_referents_AB_unique";

-- AlterTable
ALTER TABLE "_social_support_to_followup_type" ADD CONSTRAINT "_social_support_to_followup_type_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_social_support_to_followup_type_AB_unique";
