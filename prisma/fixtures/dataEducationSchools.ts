import type { Prisma } from '@prisma/client'
import { SchoolType, SchoolStatus, RepClassification } from '@prisma/client'

export enum FixtureDataEducationSchool {
  // Used by searchSchoolCity tests — distinct arrondissements of Lyon
  Lyon1erA = 0,
  Lyon1erB = 1,
  Lyon2e = 2,
  Dijon = 3,
  Villeurbanne = 4,
  // Used by searchSchools tests — schools within a single citycode
  SchLyon1 = 5,
  SchLyon2 = 6,
  SchLyon3 = 7,
  SchDijon = 8
}

export const fixturesDataEducationSchools = [
  // Lyon 1er Arrondissement — two schools sharing the same citycode (deduplication)
  {
    uai: 'TEST-LYON-1',
    name: 'Ecole Jean Moulin',
    type: SchoolType.Ecole,
    nature: 'Ecole élémentaire publique',
    address: '12 rue Jean Moulin',
    zipcode: '69001',
    city: 'Lyon 1er Arrondissement',
    citycode: '69381',
    department: 'Rhône',
    region: 'Auvergne-Rhône-Alpes',
    academy: 'Lyon',
    status: SchoolStatus.OUVERT,
    lastImportedAt: new Date('2025-01-01')
  },
  {
    uai: 'TEST-LYON-3',
    name: 'Ecole Condorcet',
    type: SchoolType.Ecole,
    nature: 'Ecole élémentaire publique',
    address: null,
    zipcode: '69001',
    city: 'Lyon 1er Arrondissement',
    citycode: '69381',
    department: 'Rhône',
    region: 'Auvergne-Rhône-Alpes',
    academy: 'Lyon',
    status: SchoolStatus.OUVERT,
    lastImportedAt: new Date('2025-01-01')
  },
  // Lyon 2e Arrondissement — distinct citycode from Lyon 1er
  {
    uai: 'TEST-LYON-2',
    name: 'Ecole Victor Hugo',
    type: SchoolType.Ecole,
    nature: 'Ecole élémentaire publique',
    address: '3 place Carnot',
    zipcode: '69002',
    city: 'Lyon 2e Arrondissement',
    citycode: '69382',
    department: 'Rhône',
    region: 'Auvergne-Rhône-Alpes',
    academy: 'Lyon',
    status: SchoolStatus.OUVERT,
    lastImportedAt: new Date('2025-01-01')
  },
  {
    uai: 'TEST-DIJON-1',
    name: 'Ecole des Peupliers',
    type: SchoolType.Ecole,
    nature: 'Ecole élémentaire publique',
    address: '8 avenue de la Gare',
    zipcode: '21000',
    city: 'Dijon',
    citycode: '21231',
    department: "Côte-d'Or",
    region: 'Bourgogne-Franche-Comté',
    academy: 'Dijon',
    status: SchoolStatus.OUVERT,
    lastImportedAt: new Date('2025-01-01')
  },
  {
    uai: 'TEST-VILLEURBANNE-1',
    name: 'Ecole Anatole France',
    type: SchoolType.Ecole,
    nature: 'Ecole élémentaire publique',
    address: null,
    zipcode: '69100',
    city: 'Villeurbanne',
    citycode: '69266',
    department: 'Rhône',
    region: 'Auvergne-Rhône-Alpes',
    academy: 'Lyon',
    status: SchoolStatus.OUVERT,
    lastImportedAt: new Date('2025-01-01')
  },

  // --- searchSchools fixtures (filter by citycode + name) ---

  {
    uai: 'TEST-SCH-LYON-1',
    name: 'Ecole Jean Moulin',
    type: SchoolType.Ecole,
    nature: 'Ecole élémentaire publique',
    address: '5 rue de la Paix',
    zipcode: '69001',
    city: 'Lyon',
    citycode: '69123',
    department: 'Rhône',
    region: 'Auvergne-Rhône-Alpes',
    academy: 'Lyon',
    status: SchoolStatus.OUVERT,
    repClassification: RepClassification.Rep,
    lastImportedAt: new Date('2025-01-01')
  },
  {
    uai: 'TEST-SCH-LYON-2',
    name: 'Ecole Victor Hugo',
    type: SchoolType.Ecole,
    nature: 'Ecole primaire publique',
    address: null,
    zipcode: '69001',
    city: 'Lyon',
    citycode: '69123',
    department: 'Rhône',
    region: 'Auvergne-Rhône-Alpes',
    academy: 'Lyon',
    status: SchoolStatus.OUVERT,
    repClassification: RepClassification.RepPlus,
    qpvCode: 'QP069001',
    qpvName: 'Les Minguettes',
    lastImportedAt: new Date('2025-01-01')
  },
  {
    uai: 'TEST-SCH-LYON-3',
    name: 'Collège Jean Jaurès',
    type: SchoolType.College,
    nature: 'Collège',
    address: '18 boulevard des Brotteaux',
    zipcode: '69001',
    city: 'Lyon',
    citycode: '69123',
    department: 'Rhône',
    region: 'Auvergne-Rhône-Alpes',
    academy: 'Lyon',
    status: SchoolStatus.OUVERT,
    qpvCode: 'QP069002',
    qpvName: 'La Duchère',
    lastImportedAt: new Date('2025-01-01')
  },
  {
    uai: 'TEST-SCH-DIJON-1',
    name: 'Ecole des Peupliers',
    type: SchoolType.Ecole,
    nature: 'Ecole élémentaire publique',
    address: '2 rue des Peupliers',
    zipcode: '21000',
    city: 'Dijon',
    citycode: '21231',
    department: "Côte-d'Or",
    region: 'Bourgogne-Franche-Comté',
    academy: 'Dijon',
    status: SchoolStatus.OUVERT,
    lastImportedAt: new Date('2025-01-01')
  }
] satisfies Prisma.DataEducationSchoolCreateManyInput[]
