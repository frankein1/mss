-- This is an empty migration.
DROP VIEW IF EXISTS view_beneficiary_history;
CREATE VIEW view_beneficiary_history AS (
  SELECT id,
    id as "followup_id",
    null as "help_request_id",
    beneficiary_id,
    created_by_id,
    "status"::text,
    true::boolean as "is_followup",
    medium,
    null as "examination_date",
    null as "handling_date",
    null as "external_structure",
    ARRAY(
      SELECT "B"
      FROM _followup_to_followup_type
      WHERE "A" = fu.id
    ) as type_ids,
    prescribing_organization_id,
    null as "instructor_organization_id",
    "date"
  FROM followup as fu
  UNION
  SELECT id,
    null as "followup_id",
    id as "help_request_id",
    beneficiary_id,
    created_by_id,
    "status"::text,
    false::boolean as "is_followup",
    null as "medium",
    examination_date,
    handling_date,
    external_structure,
    ARRAY [type_id] as "type_ids",
    prescribing_organization_id,
    instructor_organization_id _document_to_help_request,
    opening_date as "date"
  FROM help_request
);
