CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO budget (id, beneficiary_id) SELECT gen_random_uuid(), id FROM beneficiary;

INSERT INTO budget_expenses (id, budget_id)
    SELECT gen_random_uuid(), id FROM budget;

INSERT INTO budget_income (id, budget_id, "type")
    SELECT gen_random_uuid(), id, 'Beneficiary' FROM budget;

INSERT INTO budget_income (id, budget_id, beneficiary_relative_id, "type")
    SELECT gen_random_uuid(), b.id, br.id, 'HouseholdMember'
        FROM budget b, beneficiary_relative br
        WHERE br.hosted = true AND br.beneficiary_id = b.beneficiary_id;

 
UPDATE budget bu SET "legacy_main_income_source" = (
    select "main_income_source" FROM beneficiary be where bu.beneficiary_id = be.id
);
UPDATE budget bu SET "legacy_main_income_amount" = (
    select "main_income_amount" FROM beneficiary be where bu.beneficiary_id = be.id
);
UPDATE budget bu SET "legacy_partner_main_income_source" = (
    select "partner_main_income_source" FROM beneficiary be where bu.beneficiary_id = be.id
);
UPDATE budget bu SET "legacy_partner_main_income_amount" = (
    select "partner_main_income_amount" FROM beneficiary be where bu.beneficiary_id = be.id
);
UPDATE budget bu SET "legacy_major_children_main_income_source" = (
    select "major_children_main_income_source" FROM beneficiary be where bu.beneficiary_id = be.id
);
UPDATE budget bu SET "legacy_major_children_main_income_amount" = (
    select "major_children_main_income_amount" FROM beneficiary be where bu.beneficiary_id = be.id
);
UPDATE budget bu SET "legacy_other_members_main_income_source" = (
    select "other_members_main_income_source" FROM beneficiary be where bu.beneficiary_id = be.id
);
UPDATE budget bu SET "legacy_other_members_main_income_amount" = (
    select "other_members_main_income_amount" FROM beneficiary be where bu.beneficiary_id = be.id
);

ALTER TABLE beneficiary DROP "main_income_source";
ALTER TABLE beneficiary DROP "main_income_amount";
ALTER TABLE beneficiary DROP "partner_main_income_source";
ALTER TABLE beneficiary DROP "partner_main_income_amount";
ALTER TABLE beneficiary DROP "major_children_main_income_source";
ALTER TABLE beneficiary DROP "major_children_main_income_amount";
ALTER TABLE beneficiary DROP "other_members_main_income_source";
ALTER TABLE beneficiary DROP "other_members_main_income_amount";

DROP TYPE "IncomeSource";