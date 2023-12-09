-- CreateEnum
CREATE TYPE "HelpRequestRefusalReason" AS ENUM ('ResourcesOutOfScale', 'ShortDeadline', 'IncompleteFile', 'IrregularSituation', 'InadequateFamilyComposition', 'ExpiredRequest', 'Other');

-- AlterTable
ALTER TABLE "help_request" ADD COLUMN     "defined_refusal_reason" "HelpRequestRefusalReason";

-- Update Beneficiary History View
DROP VIEW IF EXISTS view_beneficiary_history;
CREATE VIEW view_beneficiary_history AS (
  SELECT id,
    id as "followup_id",
    null as "help_request_id",
    structure_id,
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
    "date",
    synthesis,
    private_synthesis,
    redirected,
    structure_name,
    help_requested,
    place,
    due_date,
    third_person_name,
    classified,
    first_followup,
    forwarded_to_justice,
    ministre,
    numero_pegase,
    interventions,
    signalements,
    null as "reason",
    null as "asked_amount",
    null as "decision_date",
    null as "refusal_reason",
    null as "defined_refusal_reason",
    null as "dispatch_date",
    null as "full_file",
    null as "allocated_amount",
    null as "payment_method",
    null as "payment_date"
  FROM followup as fu
  UNION
  SELECT id,
    null as "followup_id",
    id as "help_request_id",
    structure_id,
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
    opening_date as "date",
    synthesis,
    private_synthesis,
    null as "redirected",
    null as "structure_name",
    null as "help_requested",
    null as "place",
    due_date,
    null as "third_person_name",
    null as "classified",
    null as "first_followup",
    null as "forwarded_to_justice",
    ministre,
    numero_pegase,
    ARRAY []::"FollowupIntervention" [] as "interventions",
    ARRAY []::"FollowupSignalement" [] as "signalements",
    reason,
    asked_amount,
    decision_date,
    refusal_reason,
    defined_refusal_reason,
    dispatch_date,
    full_file,
    allocated_amount,
    payment_method,
    payment_date
  FROM help_request
);
