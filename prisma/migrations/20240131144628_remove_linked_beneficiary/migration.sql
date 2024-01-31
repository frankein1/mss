-- DropForeignKey
ALTER TABLE "beneficiary_relative" DROP CONSTRAINT "beneficiary_relative_beneficiary_link_id_fkey";

UPDATE beneficiary_relative br set (email, first_name, last_name, city, phone) = (
    select b.email, b.first_name, b.usual_name, b.city, b.phone1 from beneficiary b where b.id = br.beneficiary_link_id
) WHERE beneficiary_link_id is not null;
