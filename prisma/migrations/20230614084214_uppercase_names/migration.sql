update beneficiary set usual_name = upper(usual_name);
update beneficiary set birth_name = upper(birth_name);
update beneficiary set first_name = concat(upper(substring(first_name for 1)), substring(first_name from 2));
