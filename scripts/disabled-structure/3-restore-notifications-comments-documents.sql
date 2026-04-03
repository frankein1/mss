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
        recipientId uuid,
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