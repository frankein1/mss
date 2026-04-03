-- Context: restore beneficiary and social support data from disabled structure
-- The data has been anonymized and some table deleted

-- Transaction
BEGIN;

-- Beneficiaries: restore anonymized fields
-- The table family_file has been kept
-- The table _family_file_referents has been kept
-- 
UPDATE beneficiary b
SET 
    -- restore previous value before disabling structure (should be null)
    disabled_by_id = src.disabled_by_id,
    aidant_connect_authorized = src.aidant_connect_authorized,
    title = src.title::"BeneficiaryTitle",
    usual_name = src.usual_name,
    birth_name = src.birth_name,
    first_name = src.first_name,
    birth_place = src.birth_place,
    death_date = src.death_date,
    gender = src.gender::"Gender",
    nationality = src.nationality::"Nationality",
    relationship = src.relationship::"RelativeRelationship",
    accommodation_mode = src.accommodation_mode::"BeneficiaryAccommodationMode",
    accommodation_name = src.accommodation_name,
    accommodation_additional_information = src.accommodation_additional_information,
    street = src.street,
    address_complement = src.address_complement,
    zipcode = src.zipcode,
    city = src.city,
    department = src.department,
    region = src.region,
    qpv = src.qpv,
    no_phone = src.no_phone,
    phone1 = src.phone1,
    phone2 = src.phone2,
    email = src.email,
    family_situation = src.family_situation::"BeneficiaryFamilySituation",
    wedding_date = src.wedding_date,
    divorce_date = src.divorce_date,
    caregiver = src.caregiver,
    minor_children = src.minor_children,
    major_children = src.major_children,
    mobility = src.mobility::"BeneficiaryMobility",
    vulnerable_person = src.vulnerable_person,
    ministere_categorie = src.ministere_categorie::"BeneficiaryMinistereCategorie",
    ministere_departement_service_ac = src.ministere_departement_service_ac::"BeneficiaryMinistereDepartementServiceAc",
    ministere_structure = src.ministere_structure::"BeneficiaryMinistereStructure",
    gir = src.gir::"BeneficiaryGir",
    doctor = src.doctor,
    health_additional_information = src.health_additional_information,
    social_security_number = src.social_security_number,
    insurance = src.insurance,
    socio_professional_category = src.socio_professional_category::"BeneficiarySocioProfessionalCategory",
    school_name = src.school_name,
    is_school_in_qpv = src.is_school_in_qpv,
    study_level = src.study_level::"BeneficiaryStudyLevel",
    occupation = src.occupation,
    employer = src.employer,
    employer_siret = src.employer_siret,
    unemployment_number = src.unemployment_number,
    pension_organisations = src.pension_organisations::"BeneficiaryPensionOrganisation"[],
    other_pension_organisations = src.other_pension_organisations,
    caf_number = src.caf_number,
    bank = src.bank,
    funeral_contract = src.funeral_contract,
    protection_measure = src.protection_measure::"BeneficiaryProtectionMeasure",
    representative = src.representative,
    prescribing_structure = src.prescribing_structure,
    orientation_type = src.orientation_type::"BeneficiaryOrientationType",
    orientation_structure = src.orientation_structure,
    service_providers = src.service_providers,
    involved_partners = src.involved_partners,
    additional_information = src.additional_information,
    numero_pegase = src.numero_pegase,
    accommodation_zone = src.accommodation_zone::"BeneficiaryAccommodationZone",
    created = src.created,
    updated = src.updated
FROM dblink(:source_db,
'SELECT id, disabled_by_id, aidant_connect_authorized,
        title, usual_name, birth_name, first_name, birth_place, death_date,
        gender, nationality, relationship, accommodation_mode, accommodation_name,
        accommodation_additional_information,
        street, address_complement, zipcode, city, department, region,
        qpv, no_phone, phone1, phone2, email,
        family_situation, wedding_date, divorce_date, caregiver,
        minor_children, major_children, mobility, vulnerable_person,
        ministere_categorie, ministere_departement_service_ac,
        ministere_structure,
        gir, doctor, health_additional_information, social_security_number, insurance,
        socio_professional_category, school_name, is_school_in_qpv, study_level,
        occupation, employer, employer_siret, unemployment_number,
        pension_organisations, other_pension_organisations,
        caf_number, bank, funeral_contract,
        protection_measure, representative, prescribing_structure,
        orientation_type, orientation_structure, service_providers, involved_partners,
        additional_information, numero_pegase, accommodation_zone, created, updated
FROM beneficiary WHERE structure_id = ' || quote_literal(:structure_id)
) AS src(
        id uuid, disabled_by_id uuid,
        aidant_connect_authorized boolean,
        title text, usual_name text, birth_name text, first_name text,
        birth_place text, death_date date,
        gender text, nationality text, relationship text,
        accommodation_mode text, accommodation_name text,
        accommodation_additional_information text,
        street text, address_complement text, zipcode text, city text,
        department text, region text,
        qpv boolean, no_phone boolean, phone1 text, phone2 text, email text,
        family_situation text, wedding_date date, divorce_date date,
        caregiver boolean, minor_children int, major_children int,
        mobility text, vulnerable_person boolean,
        ministere_categorie text, ministere_departement_service_ac text,
        ministere_structure text,
        gir text, doctor text, health_additional_information text,
        social_security_number text, insurance text,
        socio_professional_category text, school_name text,
        is_school_in_qpv boolean, study_level text,
        occupation text, employer text, employer_siret text,
        unemployment_number text,
        pension_organisations text[], other_pension_organisations text,
        caf_number text, bank text, funeral_contract text,
        protection_measure text, representative text,
        prescribing_structure text,
        orientation_type text, orientation_structure text,
        service_providers text, involved_partners text,
        additional_information text, numero_pegase text,
        accommodation_zone text, created timestamptz, updated timestamptz
)
WHERE b.id = src.id;

-- Beneficiary Relatives: restore deleted records
INSERT INTO beneficiary_relative
SELECT * 
FROM dblink(:source_db,
'SELECT br.*
FROM beneficiary_relative br
JOIN beneficiary b
ON br.beneficiary_id = b.id
WHERE b.structure_id = ' || quote_literal(:structure_id)
) AS src(
-- because of select a.* order of columns is important, check in db
        id uuid, last_name text,first_name text, 
        relationship "RelativeRelationship",
        city text, email text, phone text,
        hosted boolean, caregiver boolean,
        beneficiary_id uuid,beneficiary_link_id uuid,
        additional_information text,
        created timestamptz, updated timestamptz,
        birth_date date
)
-- for script idempotency if a record has been created by former execution of script, it is not created again
ON CONFLICT (id) DO NOTHING;

-- Social supports: restore anonymized fields
-- Table social_support_redirection is kept
-- Table social_support_subject is kept
-- Table _social_support_to_followup_type is kept
UPDATE social_support ss
SET 
    synthesis = src.synthesis,
    private_synthesis = src.private_synthesis,
    synthesis_rich_text = src.synthesis_rich_text,
    private_synthesis_rich_text = src.private_synthesis_rich_text,
    numero_pegase = src.numero_pegase,
    -- obsolete column
    -- ministre = src.ministre,
    -- minister_id is not anonymized
    due_date = src.due_date,
    created = src.created,
    updated = src.updated
FROM dblink(:source_db,
'SELECT id, synthesis, private_synthesis, synthesis_rich_text,
        private_synthesis_rich_text, numero_pegase, due_date,
        created,updated
FROM social_support WHERE structure_id = ' || quote_literal(:structure_id)
) AS src(
        id uuid, synthesis text, private_synthesis text,
        synthesis_rich_text text, private_synthesis_rich_text text,
        numero_pegase text, due_date date,
        created timestamptz, updated timestamptz
)
WHERE ss.id = src.id;

-- File instructions: restore anonymized fields
UPDATE file_instruction fi
SET 
    instructor_organization_id = src.instructor_organization_id,
    instructor_organization_contact_id = src.instructor_organization_contact_id,
    external_structure = src.external_structure,
    examination_date = src.examination_date, decision_date = src.decision_date,
    refusal_reason = src.refusal_reason,
    refusal_reason_other = src.refusal_reason_other,
    dispatch_date = src.dispatch_date, full_file = src.full_file,
    -- no created field
    updated = src.updated
FROM dblink(:source_db,
'SELECT 
        fi.id, fi.instructor_organization_id,
        fi.instructor_organization_contact_id,
        fi.external_structure, fi.examination_date, fi.decision_date,
        fi.refusal_reason, fi.refusal_reason_other, fi.dispatch_date,
        fi.full_file, fi.updated
FROM file_instruction fi
JOIN social_support ss
ON fi.social_support_id = ss.id
WHERE ss.structure_id = ' || quote_literal(:structure_id)
) AS src(
        id uuid, instructor_organization_id uuid,
        instructor_organization_contact_id uuid,
        external_structure boolean, examination_date date, decision_date date,
        refusal_reason "FileInstructionRefusalReason", refusal_reason_other text,
        dispatch_date date, full_file boolean, updated timestamptz
)
WHERE fi.id = src.id;

-- Help requests: restore anonymized data
UPDATE help_request hr
SET 
    prescribing_organization_id = src.prescribing_organization_id,
    prescribing_organization_contact_id = src.prescribing_organization_contact_id,
    asked_amount = src.asked_amount, allocated_amount = src.allocated_amount,
    payment_method = src.payment_method,
    payment_date = src.payment_date,
    handling_date = src.handling_date, is_refundable = src.is_refundable
FROM dblink(:source_db,
'SELECT 
        hr.id, hr.prescribing_organization_id,
        hr.prescribing_organization_contact_id,
        hr.asked_amount, hr.allocated_amount, hr.payment_method,
        hr.payment_date, hr.handling_date, hr.is_refundable
FROM help_request hr
JOIN file_instruction fi
ON hr.file_instruction_id = fi.id
JOIN social_support ss
ON fi.social_support_id = ss.id
WHERE ss.structure_id = ' || quote_literal(:structure_id)
) AS src(
        id uuid, prescribing_organization_id uuid,
        prescribing_organization_contact_id uuid,
        asked_amount numeric, allocated_amount numeric,
        payment_method "PaymentMethod",
        payment_date date,
        handling_date date, is_refundable boolean
)
WHERE hr.id = src.id;

-- Housing Help Request: restore anonymized data
UPDATE housing_help_request hhr
SET prescribing_organization_id = src.prescribing_organization_id,
    prescribing_organization_contact_id = src.prescribing_organization_contact_id,
    is_first = src.is_first, first_opening_date = src.first_opening_date,
    asked_housing = src.asked_housing::"AskedHousing"[],
    unique_id = src.unique_id,
    tax_household_additional_information = src.tax_household_additional_information,
    max_rent = src.max_rent, max_charges = src.max_charges,
    housing_type = src.housing_type::"HousingType"[],
    room_count = src.room_count::"HousingRoomCount"[],
    is_pmr = src.is_pmr, reason = src.reason::"HousingReason",
    low_income_housing_type = src.low_income_housing_type::"LowIncomeHousingType"[],
    handling_date = src.handling_date
FROM dblink(:source_db,
'SELECT hhr.id, hhr.prescribing_organization_id, hhr.prescribing_organization_contact_id,
        hhr.is_first, hhr.first_opening_date, hhr.asked_housing,hhr.unique_id,
        hhr.tax_household_additional_information, hhr.max_rent,hhr.max_charges,
        hhr.housing_type, hhr.room_count, hhr.is_pmr, hhr.reason,
        hhr.low_income_housing_type, hhr.handling_date
FROM housing_help_request hhr
JOIN file_instruction fi
ON hhr.file_instruction_id = fi.id
JOIN social_support ss
ON fi.social_support_id = ss.id
WHERE ss.structure_id = ' || quote_literal(:structure_id)
) AS src(
        id uuid,
        -- partner organization and contacts have been kept
        prescribing_organization_id uuid,
        prescribing_organization_contact_id uuid,
        is_first boolean, first_opening_date date,
        asked_housing text[], unique_id text,
        tax_household_additional_information text,
        max_rent numeric, max_charges numeric,
        housing_type text[], room_count text[],
        is_pmr boolean, reason text,
        -- check type
        low_income_housing_type text[],
        handling_date date
    )
WHERE hhr.id = src.id;

-- Followup: restore anonymized fields
-- Partner organization are kept
UPDATE followup f
SET prescribing_organization_id = src.prescribing_organization_id,
    prescribing_organization_contact_id = src.prescribing_organization_contact_id,
    help_requested = src.help_requested,
    place = src.place,
    structure_name = src.structure_name,
    third_person_name = src.third_person_name,
    classified = src.classified,
    first_followup = src.first_followup,
    forwarded_to_justice = src.forwarded_to_justice,
    redirected = src.redirected,
    duration = src.duration,
    -- no created field
    updated = src.updated
FROM dblink(:source_db,
'SELECT f.id, f.prescribing_organization_id, f.prescribing_organization_contact_id,
        f.help_requested, f.place, f.structure_name, f.third_person_name,
        f.classified, f.first_followup, f.forwarded_to_justice,
        f.redirected, f.duration, f.updated
FROM followup f
JOIN social_support ss
ON f.social_support_id = ss.id
WHERE ss.structure_id = ' || quote_literal(:structure_id)
) AS src(
        id uuid, prescribing_organization_id uuid,
        prescribing_organization_contact_id uuid,
        help_requested boolean, place text, structure_name text,
        third_person_name text, classified boolean,
        first_followup boolean, forwarded_to_justice boolean,
        redirected boolean, duration "FollowupDuration", updated timestamptz
)
WHERE f.id = src.id;

-- End of transaction
-- Uncomment for dry-run
ROLLBACK;
-- Uncomment for execution
-- COMMIT;