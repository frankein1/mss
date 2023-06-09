/*
  Warnings:

  - The `ministere_departement_service_ac` column on the `beneficiary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BeneficiaryMinistereDepartementServiceAc" AS ENUM ('Ain01', 'Aisne02', 'Allier03', 'AlpeDeHauteProvence04', 'HautesAlpes05', 'AlpesMaritimes06', 'Ardeche07', 'Ardennes08', 'Ariege09', 'Aube10', 'Aude11', 'Aveyron12', 'BouchesDuRhone13', 'Calvados14', 'Cantal15', 'Charente16', 'CharenteMaritime17', 'Cher18', 'Correze19', 'CoteDOr21', 'CotesDArmor22', 'Creuse23', 'Dordogne24', 'Doubs25', 'Drome26', 'Eure27', 'EureEtLoir28', 'Finistere29', 'CorseDuSud2a', 'HauteCorse2b', 'Gard30', 'HauteGaronne31', 'Gers32', 'Gironde33', 'Herault34', 'IlleEtVilaine35', 'Indre36', 'IndreEtLoire37', 'Isere38', 'Jura39', 'Landes40', 'LoirEtCher41', 'Loire42', 'HauteLoire43', 'LoireAtlantique44', 'Loiret45', 'Lot46', 'LotEtGaronne47', 'Lozere48', 'MaineEtLoire49', 'Manche50', 'Marne51', 'HauteMarne52', 'Mayenne53', 'MeurtheEtMoselle54', 'Meuse55', 'Morbihan56', 'Moselle57', 'Nievre58', 'Nord59', 'Oise60', 'Orne61', 'PasDeCalais62', 'PuyDeDome63', 'PyreneesAtlantiques64', 'HautesPyrenees65', 'PyreneesOrientales66', 'BasRhin67', 'HautRhin68', 'Rhone69', 'HauteSaone70', 'SaoneEtLoire71', 'Sarthe72', 'Savoie73', 'HauteSavoie74', 'Paris75', 'SeineMaritime76', 'SeineEtMarne77', 'Yvelines78', 'DeuxSevres79', 'Somme80', 'Tarn81', 'TarnEtGaronne82', 'Var83', 'Vaucluse84', 'Vendee85', 'Vienne86', 'HauteVienne87', 'Vosges88', 'Yonne89', 'TerritoireDeBelfort90', 'Essonne91', 'HautsDeSeine92', 'SeineSaintDenis93', 'ValDeMarne94', 'ValDOise95', 'Guadeloupe971', 'Martinique972', 'Guyane973', 'LaReunion974', 'SaintPierreEtMiquelon975', 'Mayotte976', 'TerresAustralesEtAntarctiques984', 'WallisEtFutuna986', 'PolynesieFrancaise987', 'NouvelleCaledonie988', 'AgentsEnInstanceDaffectation', 'Chatefp', 'Cncp', 'Cnefop', 'Cng', 'Cnit', 'Cnml', 'Comjs', 'Daj', 'Dares', 'Dgefp', 'Dgos', 'Dgp', 'Dgs', 'Dgt', 'Diges', 'Djepva', 'Dnum', 'Drh', 'Ds', 'Igas', 'Igjs', 'SecretariatAuxPersonnesHandicapees', 'Sgmcas');

-- AlterTable
ALTER TABLE "beneficiary" DROP COLUMN "ministere_departement_service_ac",
ADD COLUMN     "ministere_departement_service_ac" "BeneficiaryMinistereDepartementServiceAc";
