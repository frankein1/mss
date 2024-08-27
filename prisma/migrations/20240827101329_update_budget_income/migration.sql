ALTER TABLE "budget_income" ADD COLUMN "first_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "relationship" "RelativeRelationship";

UPDATE "budget_income" bi set "first_name" = (
  SELECT br."first_name" FROM "beneficiary_relative" br WHERE br.id = bi.household_member_id
);

UPDATE "budget_income" bi set "last_name" = (
  SELECT br."last_name" FROM "beneficiary_relative" br WHERE br.id = bi.household_member_id
);

UPDATE "budget_income" bi set "relationship" = (
  SELECT br."relationship" FROM "beneficiary_relative" br WHERE br.id = bi.household_member_id
);


ALTER TABLE "budget_income" DROP COLUMN "household_member_id";


