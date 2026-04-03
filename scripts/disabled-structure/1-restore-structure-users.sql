-- Context: restore data from disabled structure
-- The data has been anonymized and some table deleted

-- Command
-- > psql $TARGET_DBURL -v structure_id="'<structureid>'" -v source_db="'<source_dburl>'" -f scripts/disabled-structure/1-restore-structure-users.sql

-- Transaction
BEGIN;

-- Test 
SELECT src.id as structure_id
FROM dblink(
    :source_db, 
    'SELECT id from structure WHERE id = ' || quote_literal(:structure_id)
) AS src(id uuid);

-- Structure: restore anonymized fields
-- workshop tables are kept
UPDATE structure s
SET 
    name = src.name,
    address = src.address,
    phone = src.phone,
    email = src.email,
    dpo_first_name = src.dpo_first_name,
    dpo_last_name = src.dpo_last_name,
    dpo_email = src.dpo_email,
    external_rdvsp_active = src.external_rdvsp_active,
    external_rdvsp_id = src.external_rdvsp_id
FROM dblink(:source_db,
'SELECT id, name, address, phone, email, dpo_first_name, dpo_last_name,
        dpo_email, external_rdvsp_active, external_rdvsp_id
FROM structure WHERE id = ' || quote_literal(:structure_id)
) AS src(
        id uuid, name text, address text, phone text, email text,
        dpo_first_name text, dpo_last_name text, dpo_email text,
        external_rdvsp_active boolean, external_rdvsp_id text
)
WHERE s.id = src.id;

-- Users: restore anonymized fields
-- Hypothesis: no user with same mails exist in the database
-- if not the case the query will fail the email unique constraint
-- cgu_history table is kept
UPDATE "public"."user" u
SET
    first_name = src.first_name,
    last_name = src.last_name,
    email = src.email,
    "status" = src.status,
    aidant_connect_authorisation = src.aidant_connect_authorisation,
    external_rdvsp_id = src.external_rdvsp_id,
    authorization_code = src.authorization_code,
    authorization_code_validity = src.authorization_code_validity,
    account_reminder_email = src.account_reminder_email
FROM dblink(:source_db,
'SELECT id, first_name, last_name, email, status,
        aidant_connect_authorisation, external_rdvsp_id,
        authorization_code, authorization_code_validity,
account_reminder_email
FROM "public"."user" WHERE structure_id = ' || quote_literal(:structure_id)
) AS src(
        id uuid, first_name text, last_name text, email text,
        status "UserStatus",
        aidant_connect_authorisation boolean, external_rdvsp_id text,
        authorization_code text, authorization_code_validity timestamptz,
        account_reminder_email int
)
WHERE u.id = src.id;

-- Accounts: restore deleted records
INSERT INTO account
SELECT *
FROM dblink(:source_db,
'SELECT a.*
FROM account a
JOIN "public"."user" u
ON a.user_id = u.id
WHERE u.structure_id = ' || quote_literal(:structure_id)
) AS src(
-- because of select a.* order of columns is important, check in db
        id text, user_id uuid, type text, provider text,
        provider_account_id text, refresh_token text, access_token text,
        expires_at int, token_type text, scope text,
        id_token text, session_state text,
        created timestamptz, updated timestamptz)
-- for script idempotency if a record has been created by former execution of script, it is not created again
ON CONFLICT (id) DO NOTHING;

-- External Accounts: restore deleted records
INSERT INTO external_account
SELECT 
        id, created, updated, user_id, provider, provider_account_id,
        refresh_token, access_token,                                                                                                                         
        -- NULLIF(expires_at, '')::timestamptz,                                                                                                                
        scope, id_token, session_state
FROM dblink(:source_db,
'SELECT ea.*
FROM external_account ea
JOIN "public"."user" u
ON ea.user_id = u.id
WHERE u.structure_id = ' || quote_literal(:structure_id)
) AS src(
-- because of select ea.* order of columns is important, check in db
        id uuid, created timestamptz, updated timestamptz,
        user_id uuid, provider text, provider_account_id text,
        refresh_token text, access_token text,
        scope text, id_token text, session_state text,
        expires_at timestamptz
)
-- for script idempotency if a record has been created by former execution of script, it is not created again
ON CONFLICT (id) DO NOTHING;

-- End of transaction
-- Uncomment for dry-run
ROLLBACK;
-- Uncomment for execution
-- COMMIT;