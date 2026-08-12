-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'ArsDd75';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'ArsDd77';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'ArsDd78';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'ArsDd91';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'ArsDd92';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'ArsDd93';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'ArsDd94';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'ArsDd95';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'CabinetMinisterielAffairesSocialesSante';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'CabinetMinisterielTravail';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'ComiteHistSecu';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'Daei';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'Ddc';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'Dfas';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'Dgcs';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'Dicom';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'DirectionAffairesReservees';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'DirectionDeLaSantePublique';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'DirectionDeLaStrategie';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'DirectionDeLoffreDeSoins';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'DirectionDemocratieSanitaire';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'DirectionGeneraleAdjointe';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'Dns';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'Drees';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'Dss';
ALTER TYPE "BeneficiaryMinistereDepartementServiceAc" ADD VALUE 'Mnc';
