import type { Prisma } from '@prisma/client'

export enum FixtureDataInclusionStructure {
  MatchedCroixRouge = 0,
  MatchedSecoursCatholique = 1,
  MatchedRestosDuCoeur = 2,
  MatchedSecuriteSociale = 3,
  MatchedEmmaüs = 4,
  UnmatchedMédecins = 5,
  UnmatchedAPF = 6,
  UnmatchedATD = 7,
  UnmatchedPetitsFreres = 8,
  UnmatchedAbbéPierre = 9
}

export const fixturesDataInclusionStructures = [
  {
    id: 'croix-rouge-valence',
    name: 'Croix-Rouge française - Délégation de Valence',
    isBranch: true,
    siret: '77567227221045',
    address: '12 avenue de Verdun',
    city: 'Valence',
    zipcode: '26000',
    topics: ['aide-alimentaire', 'accompagnement-social']
  },
  {
    id: 'secours-catholique-lyon',
    name: 'Secours Catholique - Antenne de Lyon',
    isBranch: true,
    siret: '77565875415632',
    address: '45 rue de la Charité',
    city: 'Lyon',
    zipcode: '69002',
    topics: ['aide-alimentaire', 'hebergement']
  },
  {
    id: 'restos-du-coeur-grenoble',
    name: 'Les Restos du Cœur - Centre de Grenoble',
    isBranch: true,
    siret: '33209189000127',
    address: '8 rue des Alpes',
    city: 'Grenoble',
    zipcode: '38000',
    topics: ['aide-alimentaire']
  },
  {
    id: 'cpam-drome',
    name: 'CPAM de la Drôme',
    isBranch: false,
    siret: '51758468900012',
    address: '20 boulevard Vauban',
    city: 'Valence',
    zipcode: '26000',
    topics: ['sante', 'acces-aux-droits']
  },
  {
    id: 'emmaus-romans',
    name: 'Emmaüs Romans-sur-Isère',
    isBranch: true,
    siret: '30245897600045',
    address: '3 chemin des Vignes',
    city: 'Romans-sur-Isère',
    zipcode: '26100',
    topics: ['insertion-professionnelle', 'hebergement']
  },
  {
    id: 'medecins-du-monde-marseille',
    name: 'Médecins du Monde - Marseille',
    isBranch: true,
    siret: '77567227221098',
    address: '10 boulevard de la Libération',
    city: 'Marseille',
    zipcode: '13001',
    topics: ['sante']
  },
  {
    id: 'apf-france-handicap-nice',
    name: 'APF France Handicap - Nice',
    isBranch: true,
    siret: '77567227221099',
    address: '5 avenue Jean Médecin',
    city: 'Nice',
    zipcode: '06000',
    topics: ['handicap', 'acces-aux-droits']
  },
  {
    id: 'atd-quart-monde-toulouse',
    name: 'ATD Quart Monde - Toulouse',
    isBranch: true,
    address: '22 rue du Taur',
    city: 'Toulouse',
    zipcode: '31000',
    topics: ['accompagnement-social', 'insertion-professionnelle']
  },
  {
    id: 'petits-freres-pauvres-bordeaux',
    name: 'Petits Frères des Pauvres - Bordeaux',
    isBranch: true,
    address: '15 cours de Verdun',
    city: 'Bordeaux',
    zipcode: '33000',
    topics: ['isolement', 'accompagnement-social']
  },
  {
    id: 'fondation-abbe-pierre-nantes',
    name: 'Fondation Abbé Pierre - Nantes',
    isBranch: true,
    address: '4 place du Commerce',
    city: 'Nantes',
    zipcode: '44000',
    topics: ['hebergement', 'logement']
  }
] satisfies [
  Prisma.DataInclusionStructureCreateManyInput,
  Prisma.DataInclusionStructureCreateManyInput,
  Prisma.DataInclusionStructureCreateManyInput,
  Prisma.DataInclusionStructureCreateManyInput,
  Prisma.DataInclusionStructureCreateManyInput,
  Prisma.DataInclusionStructureCreateManyInput,
  Prisma.DataInclusionStructureCreateManyInput,
  Prisma.DataInclusionStructureCreateManyInput,
  Prisma.DataInclusionStructureCreateManyInput,
  Prisma.DataInclusionStructureCreateManyInput
]
