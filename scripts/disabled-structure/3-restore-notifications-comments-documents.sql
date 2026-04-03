-- Context: restore budget, notifications, comments, documents data from disabled structure
-- The data has been anonymized and some table deleted

-- Transaction
BEGIN;

-- Comments: restore deleted records
INSERT INTO comment
SELECT *
FROM dblink(:source_db,
'SELECT c.*
FROM comment c
JOIN social_support ss
ON c.social_support_id = ss.id
WHERE ss.structure_id = ' || quote_literal(:structure_id)
) AS src(
-- because of select c.* order of columns is important, check in db
        id uuid,
        created timestamptz,
        created_by_id uuid,
        content text,
        updated timestamptz,
        social_support_id uuid
)
ON CONFLICT (id) DO NOTHING;

-- Documents:  restore deleted records
INSERT INTO document
SELECT *
FROM dblink(:source_db,
'SELECT d.*
FROM document d
JOIN beneficiary b
ON d.beneficiary_id = b.id
WHERE b.structure_id = ' || quote_literal(:structure_id)
) AS src(
        key uuid,
        mime_type text,
        name text,
        filename_disk text,
        filename_download text,
        type "DocumentType",
        size int,
        tags text[],
        confidential boolean,
        beneficiary_id uuid,
        created timestamptz,
        -- no updated column
        created_by_id uuid,
        migrated boolean,
        family_file_id uuid,
        expiration_date date
)
-- for script idempotency if a record has been created by former execution of script, it is not created again
ON CONFLICT (key) DO NOTHING;

-- Document: restore pivot table document <-> social_support
INSERT INTO _document_to_social_support ("A", "B")
SELECT * 
FROM dblink(:source_db,
'SELECT dss."A", dss."B"
FROM _document_to_social_support dss
JOIN document d
ON dss."A" = d.key
JOIN beneficiary b
ON d.beneficiary_id = b.id
WHERE b.structure_id = ' || quote_literal(:structure_id)
) AS src(
        "A" uuid,
        "B" uuid
)
-- for script idempotency if a record has been created by former execution of script, it is not created again
ON CONFLICT DO NOTHING;

-- Notifications:  restore deleted records
-- all records are not deleted by structure deactivation, only those linked to documents and comments
INSERT INTO notification
SELECT *
FROM dblink(:source_db,
'SELECT n.*
FROM notification n
JOIN "public"."user" u
ON n.recipient_id = u.id
WHERE u.structure_id = ' || quote_literal(:structure_id)
) AS src(
-- because of select n.* order of columns is important, check in db
        id uuid,
        created timestamptz,
        recipient_id uuid,
        beneficiary_id uuid,
        document_id uuid,
        read boolean,
        type "NotificationType",
        comment_id uuid,
        item_created_by_id uuid,
        structure_id uuid,
        received_by_id uuid, 
        detail text,
        archive_date timestamptz
)
-- for script idempotency if a record has been created by former execution of script, it is not created again
ON CONFLICT (id) DO NOTHING;

-- Budget: restore deleted records
-- Insert order matters: budget → budget_income / budget_expenses → their children
INSERT INTO budget
SELECT *
FROM dblink(:source_db,
'SELECT b.*
FROM budget b
JOIN family_file ff
ON b.family_file_id = ff.id
WHERE ff.structure_id = ' || quote_literal(:structure_id)
) AS src(
-- because of select b.* order of columns is important, check in db
        id uuid,
        legacy_main_income_source text,
        legacy_main_income_amount numeric,
        legacy_partner_main_income_source text,
        legacy_partner_main_income_amount numeric,
        legacy_major_children_main_income_source text,
        legacy_major_children_main_income_amount numeric,
        legacy_other_members_main_income_source text,
        legacy_other_members_main_income_amount numeric,
        legacy_remaining_after_expenses numeric,
        savings numeric,
        overdraft numeric,
        family_quotient numeric,
        banque_de_france numeric,
        number_household_members numeric,
        created timestamptz,
        updated timestamptz,
        family_file_id uuid
)
ON CONFLICT (id) DO NOTHING;

-- Budget income: restore deleted records
INSERT INTO budget_income
SELECT *
FROM dblink(:source_db,
'SELECT bi.*
FROM budget_income bi
JOIN budget b
ON bi.budget_id = b.id
JOIN family_file ff
ON b.family_file_id = ff.id
WHERE ff.structure_id = ' || quote_literal(:structure_id)
) AS src(
-- because of select bi.* order of columns is important, check in db
        id uuid,
        salary numeric,
        prime_activite numeric,
        retirement numeric,
        alimony numeric,
        disability numeric,
        unemployment numeric,
        ass numeric,
        rsa numeric,
        apl numeric,
        family numeric,
        aah numeric,
        aspa numeric,
        daily_allowance numeric,
        annuity numeric,
        other numeric,
        type "BudgetIncomeType",
        budget_id uuid,
        created timestamptz,
        updated timestamptz,
        beneficiary_id uuid,
        last_name text,
        first_name text,
        relationship "RelativeRelationship"
)
ON CONFLICT (id) DO NOTHING;

-- Budget income custom: restore deleted records
INSERT INTO budget_income_custom
SELECT *
FROM dblink(:source_db,
'SELECT bic.*
FROM budget_income_custom bic
JOIN budget_income bi
ON bic.income_id = bi.id
JOIN budget b
ON bi.budget_id = b.id
JOIN family_file ff
ON b.family_file_id = ff.id
WHERE ff.structure_id = ' || quote_literal(:structure_id)
) AS src(
        id uuid,
        created timestamptz,
        updated timestamptz,
        type text,
        amount numeric,
        income_id uuid
)
ON CONFLICT (id) DO NOTHING;

-- Budget expenses: restore deleted records
INSERT INTO budget_expenses
SELECT *
FROM dblink(:source_db,
'SELECT be.*
FROM budget_expenses be
JOIN budget b
ON be.budget_id = b.id
JOIN family_file ff
ON b.family_file_id = ff.id
WHERE ff.structure_id = ' || quote_literal(:structure_id)
) AS src(
-- because of select be.* order of columns is important, check in db
        id uuid,
        rent numeric,
        expenses numeric,
        water numeric,
        electricity numeric,
        gas numeric,
        fuel_or_other numeric,
        housing_tax numeric,
        property_tax numeric,
        income_tax numeric,
        remitted_alimony numeric,
        health_insurance numeric,
        phone_internet numeric,
        other_insurance numeric,
        car_insurance numeric,
        school_fees numeric,
        school_canteen numeric,
        other numeric,
        budget_id uuid,
        death_insurance numeric,
        home_insurance numeric,
        retirement_insurance numeric,
        created timestamptz,
        updated timestamptz
)
ON CONFLICT (id) DO NOTHING;

-- Budget expenses loan: restore deleted records
INSERT INTO budget_expenses_loan
SELECT *
FROM dblink(:source_db,
'SELECT bel.*
FROM budget_expenses_loan bel
JOIN budget_expenses be
ON bel.expenses_id = be.id
JOIN budget b
ON be.budget_id = b.id
JOIN family_file ff
ON b.family_file_id = ff.id
WHERE ff.structure_id = ' || quote_literal(:structure_id)
) AS src(
        id uuid,
        type text,
        amount_total numeric,
        amount_per_month numeric,
        due_date timestamptz,
        expenses_id uuid,
        created timestamptz,
        updated timestamptz
)
ON CONFLICT (id) DO NOTHING;

-- Budget expenses debt: restore deleted records
INSERT INTO budget_expenses_debt
SELECT *
FROM dblink(:source_db,
'SELECT bed.*
FROM budget_expenses_debt bed
JOIN budget_expenses be
ON bed.expenses_id = be.id
JOIN budget b
ON be.budget_id = b.id
JOIN family_file ff
ON b.family_file_id = ff.id
WHERE ff.structure_id = ' || quote_literal(:structure_id)
) AS src(
        id uuid,
        type text,
        amount_total numeric,
        amount_per_month numeric,
        due_date timestamptz,
        expenses_id uuid,
        created timestamptz,
        updated timestamptz
)
ON CONFLICT (id) DO NOTHING;

-- Budget expenses custom: restore deleted records
INSERT INTO budget_expenses_custom
SELECT *
FROM dblink(:source_db,
'SELECT bec.*
FROM budget_expenses_custom bec
JOIN budget_expenses be
ON bec.expenses_id = be.id
JOIN budget b
ON be.budget_id = b.id
JOIN family_file ff
ON b.family_file_id = ff.id
WHERE ff.structure_id = ' || quote_literal(:structure_id)
) AS src(
        id uuid,
        created timestamptz,
        updated timestamptz,
        type text,
        amount numeric,
        expenses_id uuid
)
ON CONFLICT (id) DO NOTHING;

-- End of transaction
-- Uncomment for dry-run
ROLLBACK;
-- Uncomment for execution
-- COMMIT;

/* TODO
cast all enums!
budget tables
documents
workshops
*/