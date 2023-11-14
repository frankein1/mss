CREATE VIEW view_beneficiary_types as (
    SELECT concat(b.id, '-', ft.id) id, b.id beneficiary_id, ft.id type_id, ft.name "name"
        FROM _followup_to_followup_type ftft
            , followup f
            , followup_type ft
            , beneficiary b
        WHERE ftft."A" = f.id
            AND ftft."B" = ft.id
            AND b.id = f.beneficiary_id
UNION
    SELECT concat(b.id, '-', ft.id) id, b.id beneficiary_id, hr.type_id, ft.name "name"
        FROM help_request hr
            , beneficiary b
            , followup_type ft
        WHERE b.id = hr.beneficiary_id
            AND hr.type_id = ft.id
);