-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'Disabled');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Administrator', 'StructureManager', 'SocialWorker', 'Instructor', 'ReceptionAgent', 'Referent');

-- CreateEnum
CREATE TYPE "StructureType" AS ENUM ('Ccas', 'Cias', 'Commune', 'Association', 'Ministere');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('Cerfa', 'HistoriqueCourrier', 'Justificatifs', 'Rapports');

-- CreateEnum
CREATE TYPE "DefaultFollowupType" AS ENUM ('AideMedicaleDEtat', 'AideSociale', 'AllocationDeSolidariteAuxPersonnesAgees', 'AllocationPersonnaliseesDAutonomie', 'ComplementaireSanteSolidaire', 'DemandeDAidesMenageres', 'Domiciliation', 'EntreeEnEtablissementPourPersonnesHandicapees', 'EntreeEnFamilleDAccueil', 'EntreeEnHebergementPourPersonnesAgees', 'ObligationAlimentaire', 'Puma', 'RevenuDeSolidariteActive', 'AccompagnementSocial', 'AideAlimentaire', 'AideAuTransport', 'AidesFinancieresNonRemboursables', 'AidesFinancieresRemboursables', 'AnimationsFamilles', 'AnimationsSeniors', 'InclusionNumerique', 'Other', 'PlanAlerteEtUrgence', 'SoutienAdministratif');

-- CreateEnum
CREATE TYPE "FollowupMedium" AS ENUM ('PlannedInPerson', 'UnplannedInPerson', 'PhoneCall', 'BeneficiaryHouseAppointment', 'ExternalAppointment', 'PostalMail', 'Email', 'Videoconference', 'ThirdParty');

-- CreateEnum
CREATE TYPE "FollowupStatus" AS ENUM ('Todo', 'InProgress', 'Done');

-- CreateEnum
CREATE TYPE "FollowupIntervention" AS ENUM ('DeetsSiao', 'Prefecture', 'Bailleur', 'ActionLogement', 'SecoursMedecinTraitant');

-- CreateEnum
CREATE TYPE "FollowupSignalement" AS ENUM ('ChefCabinet', 'Prefet', 'OrganismeMenace');

-- CreateEnum
CREATE TYPE "HelpRequestStatus" AS ENUM ('WaitingAdditionalInformation', 'InvestigationOngoing', 'Accepted', 'Refused', 'Adjourned', 'ClosedByBeneficiary', 'Dismissed');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('WireTransfer', 'CreditCard', 'Cash', 'Check', 'FoodStamps');

-- CreateEnum
CREATE TYPE "HelpRequestReason" AS ENUM ('Energy', 'Food', 'Housing', 'Other');

-- CreateEnum
CREATE TYPE "BeneficiaryStatus" AS ENUM ('Active', 'Inactive', 'Archived', 'Deceased');

-- CreateEnum
CREATE TYPE "BeneficiaryTitle" AS ENUM ('Mister', 'Miss');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "Nationality" AS ENUM ('FRA', 'AFG', 'ALB', 'DZA', 'DEU', 'USA', 'AND', 'AGO', 'ATG', 'ARG', 'ARM', 'AUS', 'AUT', 'AZE', 'BHS', 'BHR', 'BGD', 'BRB', 'BEL', 'BLZ', 'BEN', 'BTN', 'BLR', 'MMR', 'GNB', 'BOL', 'BIH', 'BWA', 'BRA', 'GBR', 'BRN', 'BGR', 'BFA', 'BDI', 'KHM', 'CMR', 'CAN', 'CPV', 'CAF', 'CHL', 'CHN', 'CYP', 'COL', 'COM', 'COG', 'COD', 'COK', 'CRI', 'HRV', 'CUB', 'DNK', 'DJI', 'DOM', 'DMA', 'EGY', 'ARE', 'GNQ', 'ECU', 'ERI', 'ESP', 'TLS', 'EST', 'ETH', 'FJI', 'FIN', 'GAB', 'GMB', 'GEO', 'GHA', 'GRD', 'GTM', 'GIN', 'GUY', 'HTI', 'GRC', 'HND', 'HUN', 'IND', 'IDN', 'IRQ', 'IRN', 'IRL', 'ISL', 'ISR', 'ITA', 'CIV', 'JAM', 'JPN', 'JOR', 'KAZ', 'KEN', 'KGZ', 'KIR', 'KNA', 'KWT', 'LAO', 'LSO', 'LVA', 'LBN', 'LBR', 'LBY', 'LIE', 'LTU', 'LUX', 'MKD', 'MYS', 'MWI', 'MDV', 'MDG', 'MLI', 'MLT', 'MAR', 'MHL', 'MUS', 'MRT', 'MEX', 'FSM', 'MDA', 'MCO', 'MNG', 'MNE', 'MOZ', 'NAM', 'NRU', 'NLD', 'NZL', 'NPL', 'NIC', 'NGA', 'NER', 'NIU', 'PRK', 'NOR', 'OMN', 'UGA', 'UZB', 'PAK', 'PLW', 'PSE', 'PAN', 'PNG', 'PRY', 'PER', 'PHL', 'POL', 'PRT', 'QAT', 'ROU', 'RUS', 'RWA', 'LCA', 'SMR', 'VCT', 'SLB', 'SLV', 'WSM', 'STP', 'SAU', 'SEN', 'SRB', 'SYC', 'SLE', 'SGP', 'SVK', 'SVN', 'SOM', 'SDN', 'LKA', 'ZAF', 'KOR', 'SSD', 'SWE', 'CHE', 'SUR', 'SWZ', 'SYR', 'TJK', 'TZA', 'TCD', 'CZE', 'THA', 'TGO', 'TON', 'TTO', 'TUN', 'TKM', 'TUR', 'TUV', 'UKR', 'URY', 'VUT', 'VAT', 'VEN', 'VNM', 'YEM', 'ZMB', 'ZWE');

-- CreateEnum
CREATE TYPE "BeneficiaryAccommodationMode" AS ENUM ('None', 'Owner', 'SocialRenting', 'PrivateRenting', 'Fortune', 'EmergencyHousing', 'Other', 'ThirdPerson', 'Parents', 'Substandard', 'NursingHome');

-- CreateEnum
CREATE TYPE "BeneficiaryFamilySituation" AS ENUM ('Married', 'Single', 'Widow', 'Cohabitation', 'CivilUnion', 'CoupleWithChildren', 'Divorced', 'Separated', 'SingleParentWithChildren', 'Other');

-- CreateEnum
CREATE TYPE "BeneficiaryMobility" AS ENUM ('PermitWithVehicle', 'PermitWithoutVehicle', 'Code', 'PermitPending', 'OtherPermit', 'PublicTransport', 'BikeOrEquivalent', 'InvalidPermit', 'VehicleWithoutPermit', 'None');

-- CreateEnum
CREATE TYPE "BeneficiaryGir" AS ENUM ('Level1', 'Level2', 'Level3', 'Level4', 'Level5', 'Level6');

-- CreateEnum
CREATE TYPE "BeneficiarySocioProfessionalCategory" AS ENUM ('Employed', 'Retired', 'JobSeeker', 'Disability', 'SickLeave', 'Housewife', 'NoActivity', 'Other');

-- CreateEnum
CREATE TYPE "IncomeSource" AS ENUM ('Rsa', 'PrimeActivite', 'PrestationsFamiliales', 'IndemnitesPoleEmploi', 'Salaire', 'Retraite', 'Aspa', 'PensionInvalidite', 'IndemnitesJournalieres', 'Aah', 'Apl', 'Autre', 'PensionAlimentaire');

-- CreateEnum
CREATE TYPE "BeneficiaryProtectionMeasure" AS ENUM ('Tutelle', 'CuratelleSimple', 'CuratelleRenforcee', 'SauvegardeDeJustice', 'HabilitationDuConjoint', 'HabilitationFamiliale', 'MesureAccompagnement', 'MandatDeProtectionFuture');

-- CreateEnum
CREATE TYPE "BeneficiaryOrientationType" AS ENUM ('Spontanee', 'Elu', 'Departement', 'Association', 'Tiers', 'SuiviCabinet', 'Autre');

-- CreateEnum
CREATE TYPE "Minister" AS ENUM ('FrancoisBraun', 'AgnesFirminLeBodo', 'JeanChristopheCombe', 'GenevieveDarrieussecq', 'OlivierDussopt', 'CaroleGrandjean');

-- CreateEnum
CREATE TYPE "BeneficiaryAccommodationZone" AS ENUM ('France', 'Europe', 'OutsideEurope');

-- CreateEnum
CREATE TYPE "BeneficiaryPensionOrganisation" AS ENUM ('AgircArrco', 'Agr', 'CnavCarsat', 'Cipav', 'Cnracl', 'Edf', 'Ircantec', 'Klesia', 'Sre', 'Ssi', 'MalakoffHumanis', 'Msa', 'ProBtp', 'RetraiteDesMines', 'Other');

-- CreateEnum
CREATE TYPE "BeneficiaryMinistereStructure" AS ENUM ('AdministrationCentrale', 'Ars', 'DreetsDeetsOutreMer', 'Ddets', 'Ddetspp', 'Ddpp', 'InjaInjs', 'Ehesp', 'Intefp', 'Mnc', 'Retraites', 'Other');

-- CreateEnum
CREATE TYPE "BeneficiaryMinistereCategorie" AS ENUM ('CategorieA', 'CategorieB', 'CategorieC', 'CadreDroitPrive', 'NonCadreDroitPrive');

-- CreateEnum
CREATE TYPE "BeneficiaryMinistereDepartementServiceAc" AS ENUM ('Ain01', 'Aisne02', 'Allier03', 'AlpeDeHauteProvence04', 'HautesAlpes05', 'AlpesMaritimes06', 'Ardeche07', 'Ardennes08', 'Ariege09', 'Aube10', 'Aude11', 'Aveyron12', 'BouchesDuRhone13', 'Calvados14', 'Cantal15', 'Charente16', 'CharenteMaritime17', 'Cher18', 'Correze19', 'CoteDOr21', 'CotesDArmor22', 'Creuse23', 'Dordogne24', 'Doubs25', 'Drome26', 'Eure27', 'EureEtLoir28', 'Finistere29', 'CorseDuSud2a', 'HauteCorse2b', 'Gard30', 'HauteGaronne31', 'Gers32', 'Gironde33', 'Herault34', 'IlleEtVilaine35', 'Indre36', 'IndreEtLoire37', 'Isere38', 'Jura39', 'Landes40', 'LoirEtCher41', 'Loire42', 'HauteLoire43', 'LoireAtlantique44', 'Loiret45', 'Lot46', 'LotEtGaronne47', 'Lozere48', 'MaineEtLoire49', 'Manche50', 'Marne51', 'HauteMarne52', 'Mayenne53', 'MeurtheEtMoselle54', 'Meuse55', 'Morbihan56', 'Moselle57', 'Nievre58', 'Nord59', 'Oise60', 'Orne61', 'PasDeCalais62', 'PuyDeDome63', 'PyreneesAtlantiques64', 'HautesPyrenees65', 'PyreneesOrientales66', 'BasRhin67', 'HautRhin68', 'Rhone69', 'HauteSaone70', 'SaoneEtLoire71', 'Sarthe72', 'Savoie73', 'HauteSavoie74', 'Paris75', 'SeineMaritime76', 'SeineEtMarne77', 'Yvelines78', 'DeuxSevres79', 'Somme80', 'Tarn81', 'TarnEtGaronne82', 'Var83', 'Vaucluse84', 'Vendee85', 'Vienne86', 'HauteVienne87', 'Vosges88', 'Yonne89', 'TerritoireDeBelfort90', 'Essonne91', 'HautsDeSeine92', 'SeineSaintDenis93', 'ValDeMarne94', 'ValDOise95', 'Guadeloupe971', 'Martinique972', 'Guyane973', 'LaReunion974', 'SaintPierreEtMiquelon975', 'Mayotte976', 'TerresAustralesEtAntarctiques984', 'WallisEtFutuna986', 'PolynesieFrancaise987', 'NouvelleCaledonie988', 'AgentsEnInstanceDaffectation', 'Chatefp', 'Cncp', 'Cnefop', 'Cng', 'Cnit', 'Cnml', 'Comjs', 'Daj', 'Dares', 'Dgefp', 'Dgos', 'Dgp', 'Dgs', 'Dgt', 'Diges', 'Djepva', 'Dnum', 'Drh', 'Ds', 'Igas', 'Igjs', 'SecretariatAuxPersonnesHandicapees', 'Sgmcas');

-- CreateEnum
CREATE TYPE "RelativeRelationship" AS ENUM ('Conjoint', 'EnfantMineur', 'EnfantMajeur', 'Parent', 'Grandparent', 'Neighbour', 'Sibling', 'Tiers', 'AutreMemberDeLaFamille');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NewDocument', 'NewComment', 'DueDate', 'DueDateOneMonth', 'EndOfSupport');

-- CreateEnum
CREATE TYPE "UserActivityType" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "UserActivityObject" AS ENUM ('Comment', 'Beneficiary', 'HelpRequest', 'Followup', 'Structure', 'Document', 'Notification', 'User');

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'Active',
    "aidant_connect_authorisation" BOOLEAN DEFAULT false,
    "last_access" TIMESTAMP(3),
    "password" TEXT,
    "access_token" TEXT,
    "access_token_validity" TIMESTAMP(3),
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "structure_id" UUID,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "structure" (
    "id" UUID NOT NULL,
    "type" "StructureType" NOT NULL,
    "name" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "inhabitants_number" TEXT,
    "insee_code" TEXT,
    "siret" TEXT,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "key" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filename_disk" TEXT NOT NULL,
    "filename_download" TEXT,
    "type" "DocumentType" NOT NULL,
    "size" INTEGER,
    "tags" TEXT[],
    "confidential" BOOLEAN NOT NULL,
    "beneficiary_id" UUID NOT NULL,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" UUID NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "followup_type" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "legally_required" BOOLEAN NOT NULL,
    "default" "DefaultFollowupType",
    "legacy_id" UUID,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" UUID,
    "owned_by_structured_id" UUID NOT NULL,

    CONSTRAINT "followup_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "followup" (
    "id" UUID NOT NULL,
    "structure_id" UUID NOT NULL,
    "beneficiary_id" UUID NOT NULL,
    "created_by_id" UUID,
    "prescribing_organization_id" UUID,
    "medium" "FollowupMedium" NOT NULL,
    "date" DATE NOT NULL,
    "synthesis" TEXT,
    "status" "FollowupStatus" NOT NULL,
    "private_synthesis" TEXT,
    "help_requested" BOOLEAN,
    "place" TEXT,
    "redirected" BOOLEAN,
    "structure_name" TEXT,
    "due_date" DATE,
    "third_person_name" TEXT,
    "classified" BOOLEAN,
    "first_followup" BOOLEAN,
    "forwarded_to_justice" BOOLEAN,
    "ministre" "Minister",
    "numero_pegase" TEXT,
    "interventions" "FollowupIntervention"[],
    "signalements" "FollowupSignalement"[],
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "followup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "help_request" (
    "id" UUID NOT NULL,
    "structure_id" UUID NOT NULL,
    "beneficiary_id" UUID NOT NULL,
    "created_by_id" UUID,
    "prescribing_organization_id" UUID,
    "instructor_organization_id" UUID,
    "opening_date" DATE NOT NULL,
    "type_id" UUID NOT NULL,
    "financial_support" BOOLEAN,
    "external_structure" BOOLEAN,
    "status" "HelpRequestStatus" NOT NULL,
    "asked_amount" DECIMAL(65,30),
    "examination_date" DATE,
    "decision_date" DATE,
    "allocated_amount" DECIMAL(65,30),
    "payment_method" "PaymentMethod",
    "payment_date" DATE,
    "handling_date" DATE,
    "refusal_reason" TEXT,
    "dispatch_date" DATE,
    "synthesis" TEXT,
    "private_synthesis" TEXT,
    "due_date" DATE,
    "full_file" BOOLEAN,
    "reason" "HelpRequestReason",
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "ministre" "Minister",
    "numero_pegase" TEXT,

    CONSTRAINT "help_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beneficiary" (
    "id" UUID NOT NULL,
    "structure_id" UUID NOT NULL,
    "created_by_id" UUID,
    "archived_by_id" UUID,
    "archived" TIMESTAMP(3),
    "aidant_connect_authorized" BOOLEAN NOT NULL DEFAULT false,
    "file_number" TEXT NOT NULL,
    "status" "BeneficiaryStatus" NOT NULL,
    "title" "BeneficiaryTitle",
    "usual_name" TEXT,
    "birth_name" TEXT,
    "first_name" TEXT,
    "birth_date" DATE,
    "birth_place" TEXT,
    "death_date" DATE,
    "gender" "Gender",
    "nationality" "Nationality",
    "accommodation_mode" "BeneficiaryAccommodationMode",
    "accommodation_name" TEXT,
    "accommodation_additional_information" TEXT,
    "street" TEXT,
    "street_number" TEXT,
    "address_complement" TEXT,
    "zipcode" TEXT,
    "city" TEXT,
    "region" TEXT,
    "no_phone" BOOLEAN NOT NULL DEFAULT false,
    "phone1" TEXT,
    "phone2" TEXT,
    "email" TEXT,
    "family_situation" "BeneficiaryFamilySituation",
    "caregiver" BOOLEAN NOT NULL DEFAULT false,
    "minor_children" INTEGER,
    "major_children" INTEGER,
    "mobility" "BeneficiaryMobility",
    "ministere_categorie" "BeneficiaryMinistereCategorie",
    "ministere_departement_service_ac" "BeneficiaryMinistereDepartementServiceAc",
    "ministere_structure" "BeneficiaryMinistereStructure",
    "gir" "BeneficiaryGir",
    "doctor" TEXT,
    "health_additional_information" TEXT,
    "social_security_number" TEXT,
    "insurance" TEXT,
    "socio_professional_category" "BeneficiarySocioProfessionalCategory",
    "occupation" TEXT,
    "employer" TEXT,
    "employer_siret" TEXT,
    "main_income_source" "IncomeSource"[],
    "main_income_amount" INTEGER,
    "partner_main_income_source" "IncomeSource"[],
    "partner_main_income_amount" INTEGER,
    "major_children_main_income_source" "IncomeSource"[],
    "major_children_main_income_amount" INTEGER,
    "unemployment_number" TEXT,
    "pension_organisations" "BeneficiaryPensionOrganisation"[],
    "other_pension_organisations" TEXT,
    "caf_number" TEXT,
    "bank" TEXT,
    "funeral_contract" TEXT,
    "protection_measure" "BeneficiaryProtectionMeasure",
    "representative" TEXT,
    "prescribing_structure" TEXT,
    "orientation_type" "BeneficiaryOrientationType",
    "orientation_structure" TEXT,
    "service_providers" TEXT,
    "involved_partners" TEXT,
    "additional_information" TEXT,
    "numero_pegase" TEXT,
    "accommodation_zone" "BeneficiaryAccommodationZone",
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beneficiary_relative" (
    "id" UUID NOT NULL,
    "last_name" TEXT,
    "first_name" TEXT,
    "relationship" "RelativeRelationship",
    "city" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "hosted" BOOLEAN NOT NULL DEFAULT false,
    "caregiver" BOOLEAN NOT NULL DEFAULT false,
    "beneficiary_id" UUID NOT NULL,
    "beneficiary_link_id" UUID,
    "additional_information" TEXT,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beneficiary_relative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "help_request_id" UUID,
    "followup_id" UUID,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescribing_organization" (
    "id" UUID NOT NULL,
    "legacy_id" INTEGER,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" UUID,
    "name" TEXT NOT NULL,
    "structure_id" UUID NOT NULL,

    CONSTRAINT "prescribing_organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instructor_organization" (
    "id" UUID NOT NULL,
    "legacy_id" INTEGER,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" UUID,
    "name" TEXT NOT NULL,
    "structure_id" UUID,

    CONSTRAINT "instructor_organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "recipient_id" UUID NOT NULL,
    "beneficiary_id" UUID NOT NULL,
    "help_request_id" UUID,
    "followup_id" UUID,
    "document_id" TEXT,
    "read" BOOLEAN DEFAULT false,
    "type" "NotificationType" NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cgu_history" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" TEXT NOT NULL,

    CONSTRAINT "cgu_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "structure_id" UUID,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "object" "UserActivityObject" NOT NULL,
    "object_id" TEXT NOT NULL,
    "activity" "UserActivityType" NOT NULL,

    CONSTRAINT "user_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_document_to_followup" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_document_to_help_request" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_followup_to_followup_type" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_beneficiary_referents" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_provider_account_id_key" ON "account"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "followup_type_name_owned_by_structured_id_key" ON "followup_type"("name", "owned_by_structured_id");

-- CreateIndex
CREATE UNIQUE INDEX "beneficiary_file_number_key" ON "beneficiary"("file_number");

-- CreateIndex
CREATE UNIQUE INDEX "_document_to_followup_AB_unique" ON "_document_to_followup"("A", "B");

-- CreateIndex
CREATE INDEX "_document_to_followup_B_index" ON "_document_to_followup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_document_to_help_request_AB_unique" ON "_document_to_help_request"("A", "B");

-- CreateIndex
CREATE INDEX "_document_to_help_request_B_index" ON "_document_to_help_request"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_followup_to_followup_type_AB_unique" ON "_followup_to_followup_type"("A", "B");

-- CreateIndex
CREATE INDEX "_followup_to_followup_type_B_index" ON "_followup_to_followup_type"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_beneficiary_referents_AB_unique" ON "_beneficiary_referents"("A", "B");

-- CreateIndex
CREATE INDEX "_beneficiary_referents_B_index" ON "_beneficiary_referents"("B");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followup_type" ADD CONSTRAINT "followup_type_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followup_type" ADD CONSTRAINT "followup_type_owned_by_structured_id_fkey" FOREIGN KEY ("owned_by_structured_id") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followup" ADD CONSTRAINT "followup_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followup" ADD CONSTRAINT "followup_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followup" ADD CONSTRAINT "followup_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followup" ADD CONSTRAINT "followup_prescribing_organization_id_fkey" FOREIGN KEY ("prescribing_organization_id") REFERENCES "prescribing_organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_prescribing_organization_id_fkey" FOREIGN KEY ("prescribing_organization_id") REFERENCES "prescribing_organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_instructor_organization_id_fkey" FOREIGN KEY ("instructor_organization_id") REFERENCES "instructor_organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_request" ADD CONSTRAINT "help_request_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "followup_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiary" ADD CONSTRAINT "beneficiary_archived_by_id_fkey" FOREIGN KEY ("archived_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiary_relative" ADD CONSTRAINT "beneficiary_relative_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiary_relative" ADD CONSTRAINT "beneficiary_relative_beneficiary_link_id_fkey" FOREIGN KEY ("beneficiary_link_id") REFERENCES "beneficiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_help_request_id_fkey" FOREIGN KEY ("help_request_id") REFERENCES "help_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_followup_id_fkey" FOREIGN KEY ("followup_id") REFERENCES "followup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescribing_organization" ADD CONSTRAINT "prescribing_organization_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescribing_organization" ADD CONSTRAINT "prescribing_organization_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_organization" ADD CONSTRAINT "instructor_organization_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_organization" ADD CONSTRAINT "instructor_organization_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_help_request_id_fkey" FOREIGN KEY ("help_request_id") REFERENCES "help_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_followup_id_fkey" FOREIGN KEY ("followup_id") REFERENCES "followup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "document"("key") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cgu_history" ADD CONSTRAINT "cgu_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_document_to_followup" ADD CONSTRAINT "_document_to_followup_A_fkey" FOREIGN KEY ("A") REFERENCES "document"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_document_to_followup" ADD CONSTRAINT "_document_to_followup_B_fkey" FOREIGN KEY ("B") REFERENCES "followup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_document_to_help_request" ADD CONSTRAINT "_document_to_help_request_A_fkey" FOREIGN KEY ("A") REFERENCES "document"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_document_to_help_request" ADD CONSTRAINT "_document_to_help_request_B_fkey" FOREIGN KEY ("B") REFERENCES "help_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_followup_to_followup_type" ADD CONSTRAINT "_followup_to_followup_type_A_fkey" FOREIGN KEY ("A") REFERENCES "followup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_followup_to_followup_type" ADD CONSTRAINT "_followup_to_followup_type_B_fkey" FOREIGN KEY ("B") REFERENCES "followup_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_beneficiary_referents" ADD CONSTRAINT "_beneficiary_referents_A_fkey" FOREIGN KEY ("A") REFERENCES "beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_beneficiary_referents" ADD CONSTRAINT "_beneficiary_referents_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
