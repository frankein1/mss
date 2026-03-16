-- Prepare document migration to S3 bucket
update "public"."document" set migrated = 'false';