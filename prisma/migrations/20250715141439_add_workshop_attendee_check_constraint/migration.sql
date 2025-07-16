ALTER TABLE workshop_attendee DROP CONSTRAINT workshop_attendee_check;

ALTER TABLE workshop_attendee
ADD CONSTRAINT check_attendee_type_and_ids
CHECK (
  (type = 'Beneficiary' AND beneficiary_id IS NOT NULL AND workshop_external_attendee_id IS NULL)
  OR
  (type != 'Beneficiary' AND beneficiary_id IS NULL AND workshop_external_attendee_id IS NOT NULL)
);
