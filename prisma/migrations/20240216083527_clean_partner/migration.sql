-- CLEAN DATA
CREATE TABLE temp AS (SELECT structure_id, replace(lower(name),' ', '') clean_name, id FROM partner_organization);
ALTER TABLE temp ADD source_id UUID;
UPDATE temp t1 SET source_id = (SELECT t2.id FROM temp t2 WHERE t1.structure_id = t2.structure_id AND t1.clean_name = t2.clean_name order by t2.id limit 1); 

UPDATE followup f SET prescribing_organization_id = (
  SELECT t.source_id FROM temp t WHERE f.prescribing_organization_id = t.id
) WHERE EXISTS (
  SELECT t.source_id FROM temp t WHERE f.prescribing_organization_id = t.id
);

UPDATE file_instruction f SET instructor_organization_id = (
  SELECT t.source_id FROM temp t WHERE f.instructor_organization_id = t.id
) WHERE EXISTS (
  SELECT t.source_id FROM temp t WHERE f.instructor_organization_id = t.id
);

UPDATE help_request f SET prescribing_organization_id = (
  SELECT t.source_id FROM temp t WHERE f.prescribing_organization_id = t.id
) WHERE EXISTS (
  SELECT t.source_id FROM temp t WHERE f.prescribing_organization_id = t.id
);

DELETE FROM partner_organization where id in (select t.id from temp t where t.id <> t.source_id);

DROP TABLE temp;
