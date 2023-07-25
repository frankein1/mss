import {
  Minister,
  BeneficiaryMinistereStructure,
  BeneficiaryMinistereCategorie,
  BeneficiaryMinistereDepartementServiceAc
} from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

const currentMinisterLabels = {
  [Minister.AurelienRousseau]: 'Aurélien Rousseau (Santé et Prévention)',
  [Minister.AuroreBerge]: 'Aurore Berge (Solidarités et Familles)',
  [Minister.FadilaKhattabi]: 'Fadila Khattabi (Personnes handicapées)',
  [Minister.OlivierDussopt]:
    'Olivier Dussopt (Travail, Plein emploi et Insertion)',
  [Minister.CaroleGrandjean]:
    'Carole Grandjean (Enseignement, Formation professionnels)'
}

const currentMinisterOptions = labelsToOptions(currentMinisterLabels)

const ministerLabels = {
  ...currentMinisterLabels,
  [Minister.FrancoisBraun]: 'François Braun (Santé et Prévention)',
  [Minister.AgnesFirminLeBodo]: 'Agnès Firmin-Le Bodo (Santé et Prévention)',
  [Minister.JeanChristopheCombe]:
    'Jean-Christophe Combe (Solidarités, Autonomie et Personnes handicapées)',
  [Minister.GenevieveDarrieussecq]:
    'Geneviève Darrieussecq (Personnes handicapées)'
}

const ministerOptions = labelsToOptions(ministerLabels)

const ministereDepartmentServiceAcLabels: {
  [key in BeneficiaryMinistereDepartementServiceAc]: string
} = {
  [BeneficiaryMinistereDepartementServiceAc.Ain01]: '(01) Ain',
  [BeneficiaryMinistereDepartementServiceAc.Aisne02]: '(02) Aisne',
  [BeneficiaryMinistereDepartementServiceAc.Allier03]: '(03) Allier',
  [BeneficiaryMinistereDepartementServiceAc.AlpeDeHauteProvence04]:
    '(04) Alpes-de-Haute-Provence',
  [BeneficiaryMinistereDepartementServiceAc.HautesAlpes05]: '(05) Hautes-Alpes',
  [BeneficiaryMinistereDepartementServiceAc.AlpesMaritimes06]:
    '(06) Alpes-Maritimes',
  [BeneficiaryMinistereDepartementServiceAc.Ardeche07]: '(07) Ardèche',
  [BeneficiaryMinistereDepartementServiceAc.Ardennes08]: '(08) Ardennes',
  [BeneficiaryMinistereDepartementServiceAc.Ariege09]: '(09) Ariège',
  [BeneficiaryMinistereDepartementServiceAc.Aube10]: '(10) Aube',
  [BeneficiaryMinistereDepartementServiceAc.Aude11]: '(11) Aude',
  [BeneficiaryMinistereDepartementServiceAc.Aveyron12]: '(12) Aveyron',
  [BeneficiaryMinistereDepartementServiceAc.BouchesDuRhone13]:
    '(13) Bouches-du-Rhône',
  [BeneficiaryMinistereDepartementServiceAc.Calvados14]: '(14) Calvados',
  [BeneficiaryMinistereDepartementServiceAc.Cantal15]: '(15) Cantal',
  [BeneficiaryMinistereDepartementServiceAc.Charente16]: '(16) Charente',
  [BeneficiaryMinistereDepartementServiceAc.CharenteMaritime17]:
    '(17) Charente-Maritime',
  [BeneficiaryMinistereDepartementServiceAc.Cher18]: '(18) Cher',
  [BeneficiaryMinistereDepartementServiceAc.Correze19]: '(19) Corrèze',
  [BeneficiaryMinistereDepartementServiceAc.CoteDOr21]: "(21) Côte-d'Or",
  [BeneficiaryMinistereDepartementServiceAc.CotesDArmor22]:
    "(22) Côtes-d'Armor",
  [BeneficiaryMinistereDepartementServiceAc.Creuse23]: '(23) Creuse',
  [BeneficiaryMinistereDepartementServiceAc.Dordogne24]: '(24) Dordogne',
  [BeneficiaryMinistereDepartementServiceAc.Doubs25]: '(25) Doubs',
  [BeneficiaryMinistereDepartementServiceAc.Drome26]: '(26) Drôme',
  [BeneficiaryMinistereDepartementServiceAc.Eure27]: '(27) Eure',
  [BeneficiaryMinistereDepartementServiceAc.EureEtLoir28]: '(28) Eure-et-Loir',
  [BeneficiaryMinistereDepartementServiceAc.Finistere29]: '(29) Finistère',
  [BeneficiaryMinistereDepartementServiceAc.CorseDuSud2a]: '(2A) Corse-du-Sud',
  [BeneficiaryMinistereDepartementServiceAc.HauteCorse2b]: '(2B) Haute-Corse',
  [BeneficiaryMinistereDepartementServiceAc.Gard30]: '(30) Gard',
  [BeneficiaryMinistereDepartementServiceAc.HauteGaronne31]:
    '(31) Haute-Garonne',
  [BeneficiaryMinistereDepartementServiceAc.Gers32]: '(32) Gers',
  [BeneficiaryMinistereDepartementServiceAc.Gironde33]: '(33) Gironde',
  [BeneficiaryMinistereDepartementServiceAc.Herault34]: '(34) Hérault',
  [BeneficiaryMinistereDepartementServiceAc.IlleEtVilaine35]:
    '(35) Ille-et-Vilaine',
  [BeneficiaryMinistereDepartementServiceAc.Indre36]: '(36) Indre',
  [BeneficiaryMinistereDepartementServiceAc.IndreEtLoire37]:
    '(37) Indre-et-Loire',
  [BeneficiaryMinistereDepartementServiceAc.Isere38]: '(38) Isère',
  [BeneficiaryMinistereDepartementServiceAc.Jura39]: '(39) Jura',
  [BeneficiaryMinistereDepartementServiceAc.Landes40]: '(40) Landes',
  [BeneficiaryMinistereDepartementServiceAc.LoirEtCher41]: '(41) Loir-et-Cher',
  [BeneficiaryMinistereDepartementServiceAc.Loire42]: '(42) Loire',
  [BeneficiaryMinistereDepartementServiceAc.HauteLoire43]: '(43) Haute-Loire',
  [BeneficiaryMinistereDepartementServiceAc.LoireAtlantique44]:
    '(44) Loire-Atlantique',
  [BeneficiaryMinistereDepartementServiceAc.Loiret45]: '(45) Loiret',
  [BeneficiaryMinistereDepartementServiceAc.Lot46]: '(46) Lot',
  [BeneficiaryMinistereDepartementServiceAc.LotEtGaronne47]:
    '(47) Lot-et-Garonne',
  [BeneficiaryMinistereDepartementServiceAc.Lozere48]: '(48) Lozère',
  [BeneficiaryMinistereDepartementServiceAc.MaineEtLoire49]:
    '(49) Maine-et-Loire',
  [BeneficiaryMinistereDepartementServiceAc.Manche50]: '(50) Manche',
  [BeneficiaryMinistereDepartementServiceAc.Marne51]: '(51) Marne',
  [BeneficiaryMinistereDepartementServiceAc.HauteMarne52]: '(52) Haute-Marne',
  [BeneficiaryMinistereDepartementServiceAc.Mayenne53]: '(53) Mayenne',
  [BeneficiaryMinistereDepartementServiceAc.MeurtheEtMoselle54]:
    '(54) Meurthe-et-Moselle',
  [BeneficiaryMinistereDepartementServiceAc.Meuse55]: '(55) Meuse',
  [BeneficiaryMinistereDepartementServiceAc.Morbihan56]: '(56) Morbihan',
  [BeneficiaryMinistereDepartementServiceAc.Moselle57]: '(57) Moselle',
  [BeneficiaryMinistereDepartementServiceAc.Nievre58]: '(58) Nièvre',
  [BeneficiaryMinistereDepartementServiceAc.Nord59]: '(59) Nord',
  [BeneficiaryMinistereDepartementServiceAc.Oise60]: '(60) Oise',
  [BeneficiaryMinistereDepartementServiceAc.Orne61]: '(61) Orne',
  [BeneficiaryMinistereDepartementServiceAc.PasDeCalais62]:
    '(62) Pas-de-Calais',
  [BeneficiaryMinistereDepartementServiceAc.PuyDeDome63]: '(63) Puy-de-Dôme',
  [BeneficiaryMinistereDepartementServiceAc.PyreneesAtlantiques64]:
    '(64) Pyrénées-Atlantiques',
  [BeneficiaryMinistereDepartementServiceAc.HautesPyrenees65]:
    '(65) Hautes-Pyrénées',
  [BeneficiaryMinistereDepartementServiceAc.PyreneesOrientales66]:
    '(66) Pyrénées-Orientales',
  [BeneficiaryMinistereDepartementServiceAc.BasRhin67]: '(67) Bas-Rhin',
  [BeneficiaryMinistereDepartementServiceAc.HautRhin68]: '(68) Haut-Rhin',
  [BeneficiaryMinistereDepartementServiceAc.Rhone69]: '(69) Rhône',
  [BeneficiaryMinistereDepartementServiceAc.HauteSaone70]: '(70) Haute-Saône',
  [BeneficiaryMinistereDepartementServiceAc.SaoneEtLoire71]:
    '(71) Saône-et-Loire',
  [BeneficiaryMinistereDepartementServiceAc.Sarthe72]: '(72) Sarthe',
  [BeneficiaryMinistereDepartementServiceAc.Savoie73]: '(73) Savoie',
  [BeneficiaryMinistereDepartementServiceAc.HauteSavoie74]: '(74) Haute-Savoie',
  [BeneficiaryMinistereDepartementServiceAc.Paris75]: '(75) Paris',
  [BeneficiaryMinistereDepartementServiceAc.SeineMaritime76]:
    '(76) Seine-Maritime',
  [BeneficiaryMinistereDepartementServiceAc.SeineEtMarne77]:
    '(77) Seine-et-Marne',
  [BeneficiaryMinistereDepartementServiceAc.Yvelines78]: '(78) Yvelines',
  [BeneficiaryMinistereDepartementServiceAc.DeuxSevres79]: '(79) Deux-Sèvres',
  [BeneficiaryMinistereDepartementServiceAc.Somme80]: '(80) Somme',
  [BeneficiaryMinistereDepartementServiceAc.Tarn81]: '(81) Tarn',
  [BeneficiaryMinistereDepartementServiceAc.TarnEtGaronne82]:
    '(82) Tarn-et-Garonne',
  [BeneficiaryMinistereDepartementServiceAc.Var83]: '(83) Var',
  [BeneficiaryMinistereDepartementServiceAc.Vaucluse84]: '(84) Vaucluse',
  [BeneficiaryMinistereDepartementServiceAc.Vendee85]: '(85) Vendée',
  [BeneficiaryMinistereDepartementServiceAc.Vienne86]: '(86) Vienne',
  [BeneficiaryMinistereDepartementServiceAc.HauteVienne87]: '(87) Haute-Vienne',
  [BeneficiaryMinistereDepartementServiceAc.Vosges88]: '(88) Vosges',
  [BeneficiaryMinistereDepartementServiceAc.Yonne89]: '(89) Yonne',
  [BeneficiaryMinistereDepartementServiceAc.TerritoireDeBelfort90]:
    '(90) Territoire de Belfort',
  [BeneficiaryMinistereDepartementServiceAc.Essonne91]: '(91) Essonne',
  [BeneficiaryMinistereDepartementServiceAc.HautsDeSeine92]:
    '(92) Hauts-de-Seine',
  [BeneficiaryMinistereDepartementServiceAc.SeineSaintDenis93]:
    '(93) Seine-Saint-Denis',
  [BeneficiaryMinistereDepartementServiceAc.ValDeMarne94]: '(94) Val-de-Marne',
  [BeneficiaryMinistereDepartementServiceAc.ValDOise95]: "(95) Val-d'Oise",
  [BeneficiaryMinistereDepartementServiceAc.Guadeloupe971]: '(971) Guadeloupe',
  [BeneficiaryMinistereDepartementServiceAc.Martinique972]: '(972) Martinique',
  [BeneficiaryMinistereDepartementServiceAc.Guyane973]: '(973) Guyane',
  [BeneficiaryMinistereDepartementServiceAc.LaReunion974]: '(974) La Réunion',
  [BeneficiaryMinistereDepartementServiceAc.SaintPierreEtMiquelon975]:
    '(975) Saint-Pierre-et-Miquelon',
  [BeneficiaryMinistereDepartementServiceAc.Mayotte976]: '(976) Mayotte',
  [BeneficiaryMinistereDepartementServiceAc.TerresAustralesEtAntarctiques984]:
    '(984) Terres Australes et Antarctiques',
  [BeneficiaryMinistereDepartementServiceAc.WallisEtFutuna986]:
    '(986) Wallis et Futuna',
  [BeneficiaryMinistereDepartementServiceAc.PolynesieFrancaise987]:
    '(987) Polynésie Française',
  [BeneficiaryMinistereDepartementServiceAc.NouvelleCaledonie988]:
    '(988) Nouvelle-Calédonie',
  [BeneficiaryMinistereDepartementServiceAc.AgentsEnInstanceDaffectation]:
    "Agents en instance d'affectation",
  [BeneficiaryMinistereDepartementServiceAc.Chatefp]: 'CHATEFP',
  [BeneficiaryMinistereDepartementServiceAc.Cncp]: 'CNCP',
  [BeneficiaryMinistereDepartementServiceAc.Cnefop]: 'CNEFOP',
  [BeneficiaryMinistereDepartementServiceAc.Cng]: 'CNG',
  [BeneficiaryMinistereDepartementServiceAc.Cnit]: 'CNIT',
  [BeneficiaryMinistereDepartementServiceAc.Cnml]: 'CNML',
  [BeneficiaryMinistereDepartementServiceAc.Comjs]: 'COMJS',
  [BeneficiaryMinistereDepartementServiceAc.Daj]: 'DAJ',
  [BeneficiaryMinistereDepartementServiceAc.Dares]: 'DARES',
  [BeneficiaryMinistereDepartementServiceAc.Dgefp]: 'DGEFP',
  [BeneficiaryMinistereDepartementServiceAc.Dgos]: 'DGOS',
  [BeneficiaryMinistereDepartementServiceAc.Dgp]: 'DGP',
  [BeneficiaryMinistereDepartementServiceAc.Dgs]: 'DGS',
  [BeneficiaryMinistereDepartementServiceAc.Dgt]: 'DGT',
  [BeneficiaryMinistereDepartementServiceAc.Diges]: 'DIGES',
  [BeneficiaryMinistereDepartementServiceAc.Djepva]: 'DJEPVA',
  [BeneficiaryMinistereDepartementServiceAc.Dnum]: 'DNUM',
  [BeneficiaryMinistereDepartementServiceAc.Drh]: 'DRH',
  [BeneficiaryMinistereDepartementServiceAc.Ds]: 'DS',
  [BeneficiaryMinistereDepartementServiceAc.Igas]: 'IGAS',
  [BeneficiaryMinistereDepartementServiceAc.Igjs]: 'IGJS',
  [BeneficiaryMinistereDepartementServiceAc.SecretariatAuxPersonnesHandicapees]:
    'Secrétariat aux personnes handicapées',
  [BeneficiaryMinistereDepartementServiceAc.Sgmcas]: 'SGMCAS'
}

const ministereDepartmentServiceAcOptions = labelsToOptions(
  ministereDepartmentServiceAcLabels
)

const ministereStructureLabels: {
  [key in BeneficiaryMinistereStructure]: string
} = {
  [BeneficiaryMinistereStructure.AdministrationCentrale]:
    'Administration centrale',
  [BeneficiaryMinistereStructure.Ars]: 'ARS',
  [BeneficiaryMinistereStructure.DreetsDeetsOutreMer]: 'DREETS/DEETS outre-mer',
  [BeneficiaryMinistereStructure.Ddets]: 'DDETS',
  [BeneficiaryMinistereStructure.Ddetspp]: 'DDETSPP',
  [BeneficiaryMinistereStructure.Ddpp]: 'DDPP',
  [BeneficiaryMinistereStructure.InjaInjs]: 'INJA/INJS',
  [BeneficiaryMinistereStructure.Ehesp]: 'EHESP',
  [BeneficiaryMinistereStructure.Intefp]: 'INTEFP',
  [BeneficiaryMinistereStructure.Mnc]: 'MNC',
  [BeneficiaryMinistereStructure.Retraites]: 'Retraites',
  [BeneficiaryMinistereStructure.Other]: 'Autre'
}

const ministereStructureOptions = labelsToOptions(ministereStructureLabels)

const ministereCategorieLabels: {
  [key in BeneficiaryMinistereCategorie]: string
} = {
  [BeneficiaryMinistereCategorie.CategorieA]: 'Catégorie A',
  [BeneficiaryMinistereCategorie.CategorieB]: 'Catégorie B',
  [BeneficiaryMinistereCategorie.CategorieC]: 'Catégorie C',
  [BeneficiaryMinistereCategorie.CadreDroitPrive]: 'Cadre droit privé',
  [BeneficiaryMinistereCategorie.NonCadreDroitPrive]: 'Non cadre droit privé'
}

const ministereCategorieOptions = labelsToOptions(ministereCategorieLabels)

export {
  currentMinisterOptions,
  ministerLabels,
  ministerOptions,
  ministereDepartmentServiceAcLabels,
  ministereDepartmentServiceAcOptions,
  ministereStructureLabels,
  ministereStructureOptions,
  ministereCategorieLabels,
  ministereCategorieOptions
}
