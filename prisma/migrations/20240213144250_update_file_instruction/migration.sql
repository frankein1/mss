UPDATE "file_instruction" fi
  SET "type" = 'Financial'
  WHERE EXISTS (SELECT * FROM help_request hr WHERE hr.financial_support = TRUE AND hr.file_instruction_id = fi.id);

UPDATE "file_instruction" fi
  SET "type" = 'Other'
  WHERE EXISTS (SELECT * FROM help_request hr WHERE hr.financial_support = FALSE AND hr.file_instruction_id = fi.id);

UPDATE "file_instruction" fi
  SET "type" = 'Housing'
  WHERE EXISTS (SELECT * FROM housing_help_request hr WHERE hr.file_instruction_id = fi.id);

ALTER TABLE "file_instruction" ALTER COLUMN "type" SET NOT NULL;
