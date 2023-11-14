CREATE VIEW view_beneficiary_types AS (
    SELECT b.id AS beneficiary_id, ft.id AS type_id, ft.name AS "name"
    FROM _followup_to_followup_type ftft
    JOIN followup f ON ftft."A" = f.id
    JOIN followup_type ft ON ftft."B" = ft.id
    JOIN beneficiary b ON b.id = f.beneficiary_id

    UNION

    SELECT b.id AS beneficiary_id, hr.type_id, ft.name AS "name"
    FROM help_request hr
    JOIN beneficiary b ON b.id = hr.beneficiary_id
    JOIN followup_type ft ON hr.type_id = ft.id
);