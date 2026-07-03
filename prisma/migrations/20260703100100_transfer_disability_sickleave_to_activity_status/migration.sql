-- Data migration
-- Transfer the CSP values "Invalidité" (Disability) and "Arrêt maladie" (SickLeave)
-- into the activity_status array, then clear the CSP for the transferred rows.

-- Invalidité: Disability -> activity_status
UPDATE "beneficiary"
SET "activity_status" = array_append("activity_status", 'Invalidite'::"BeneficiaryActivityStatus")
WHERE "socio_professional_category" = 'Disability'
  AND NOT ('Invalidite' = ANY ("activity_status"));

-- Arrêt maladie: SickLeave -> activity_status
UPDATE "beneficiary"
SET "activity_status" = array_append("activity_status", 'ArretMaladie'::"BeneficiaryActivityStatus")
WHERE "socio_professional_category" = 'SickLeave'
  AND NOT ('ArretMaladie' = ANY ("activity_status"));

-- Clear the CSP for rows that were transferred
UPDATE "beneficiary"
SET "socio_professional_category" = NULL
WHERE "socio_professional_category" IN ('Disability', 'SickLeave');
