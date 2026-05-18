import type { Prisma } from '@prisma/client'
import { fixturesDataInclusionStructures } from './dataInclusionStructures'

const v0 = fixturesDataInclusionStructures

export enum FixtureDataInclusionStructureV1 {
  CroixRouge = 0,
  SecoursCatholique = 1,
  RestosDuCoeur = 2,
  SecuriteSociale = 3,
  Emmaüs = 4,
  MDADrôme = 5,
  CCASPortesLèsValence = 6,
  CCASTainLHermitage = 7,
  FranceServicesLivron = 8,
  MJCEtoile = 9
}

export const fixturesDataInclusionStructuresV1 = [
  // V1 partner orgs — matched to a V0 id
  {
    id: `dora--${v0[0].id}`,
    name: 'Croix-Rouge française - Délégation de Valence',
    siret: '77567227221045',
    address: '12 avenue de Verdun',
    city: 'Valence',
    zipcode: '26000',
    doublons: []
  },
  {
    id: `dora--${v0[1].id}`,
    name: 'Secours Catholique - Antenne de Lyon',
    siret: '77565875415632',
    address: '45 rue de la Charité',
    city: 'Lyon',
    zipcode: '69002',
    doublons: []
  },
  {
    id: `dora--${v0[2].id}`,
    name: 'Les Restos du Cœur - Centre de Grenoble',
    siret: '33209189000127',
    address: '8 rue des Alpes',
    city: 'Grenoble',
    zipcode: '38000',
    doublons: []
  },
  {
    id: `dora--${v0[3].id}`,
    name: 'CPAM de la Drôme',
    siret: '51758468900012',
    address: '20 boulevard Vauban',
    city: 'Valence',
    zipcode: '26000',
    doublons: []
  },
  {
    id: `dora--${v0[4].id}`,
    name: 'Emmaüs Romans-sur-Isère',
    siret: '30245897600045',
    address: '3 chemin des Vignes',
    city: 'Romans-sur-Isère',
    zipcode: '26100',
    doublons: []
  },
  // V1 partner orgs only - no V0 equivalent
  {
    id: 'ma-boussole-aidants--10012430',
    name: "Maison Départementale de l'Autonomie (MDA) de la Drôme",
    siret: '22260001700016',
    address: '30 rue Henri Barbusse',
    city: 'Valence',
    zipcode: '26000',
    doublons: []
  },
  {
    id: 'ma-boussole-aidants--10004354',
    name: "Centre communal d'action sociale (CCAS) - Portes-lès-Valence",
    siret: '26260211300017',
    address: '2 place Jean Jaurès',
    city: 'Portes-lès-Valence',
    zipcode: '26800',
    doublons: []
  },
  {
    id: 'ma-boussole-aidants--10004359',
    name: "Centre communal d'action sociale (CCAS) - Tain-l'Hermitage",
    siret: '26261006600017',
    address: '18 avenue Jean Jaurès',
    city: "Tain-l'Hermitage",
    zipcode: '26600',
    doublons: []
  },
  {
    id: 'mediation-numerique--France-Services_157',
    name: 'France services Livron',
    address: '5 place de la Mairie',
    city: 'Livron-sur-Drôme',
    zipcode: '26250',
    doublons: []
  },
  {
    id: 'mediation-numerique--Hinaura_MjcEtoile3',
    name: 'MJC Etoile',
    siret: '39362264200022',
    address: '14 rue de la République',
    city: 'Étoile-sur-Rhône',
    zipcode: '26800',
    doublons: []
  }
] satisfies Prisma.DataInclusionStructureV1CreateManyInput[]
