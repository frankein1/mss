-- DropForeignKey
ALTER TABLE "beneficiary_relative" DROP CONSTRAINT "beneficiary_relative_beneficiary_link_id_fkey";

UPDATE beneficiary_relative br 
SET 
    first_name = (SELECT first_name FROM beneficiary b WHERE br.beneficiary_link_id = b.id),
    last_name = (SELECT last_name FROM beneficiary b WHERE br.beneficiary_link_id = b.id),
    birth_date = (SELECT birth_date FROM beneficiary b WHERE br.beneficiary_link_id = b.id),
    email = (SELECT email FROM beneficiary b WHERE br.beneficiary_link_id = b.id),
    phone = (SELECT phone1 FROM beneficiary b WHERE br.beneficiary_link_id = b.id),
    city = (SELECT city FROM beneficiary b WHERE br.beneficiary_link_id = b.id)
WHERE br.beneficiary_link_id IS NOT NULL;
