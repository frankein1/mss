import { Prisma } from '@prisma/client'
import { fixtureStructures, fixturesUsers, FixtureUserRole } from './'

export enum FixtureBeneficiary {
  TEARLE = 0,
  PENSON = 1,
  COURSOR = 2,
  UNKNOWN = 3,
  WONFAR = 4,
  PISCOPO = 5,
  APFELMANN = 6,
  BREITLING = 7,
  HEINIG = 8,
  PENBERTHY = 9,
  DOWNER = 10
}

export const fixturesBeneficiaries = [
  {
    id: 'aad15576-27cc-4a75-98f1-cdcb38808b83',
    familyFileId: 'aad15576-27cc-4a75-98f1-cdcb38808b83',
    fileNumber: '8e2a0a55-6da2-4228-9b3c-1c5313f9244d',
    structureId: fixtureStructures[0].id,
    status: 'Archived',
    usualName: 'TEARLE',
    birthName: 'FIRTH',
    firstName: 'Måns'
  },
  {
    id: '31152daf-0fdb-4340-aaf1-cbdab1aa1f1a',
    familyFileId: '31152daf-0fdb-4340-aaf1-cbdab1aa1f1a',
    fileNumber: '7fdd1c2e-106c-49d9-a37e-8526ad8347ae',
    structureId: fixtureStructures[0].id,
    status: 'Deceased',
    title: 'Mister',
    usualName: 'PENSON',
    firstName: 'Táng',
    deathDate: new Date('2017-08-29'),
    gender: 'Female',
    email: 'jwedderburn7@businesswire.com'
  },
  {
    id: '5a055c3b-9e39-493d-bc4d-c59a0de8947d',
    familyFileId: '5a055c3b-9e39-493d-bc4d-c59a0de8947d',
    fileNumber: 'c517a4aa-3760-408b-b140-429561ea363b',
    structureId: fixtureStructures[0].id,
    status: 'Active',
    usualName: 'COURSOR',
    birthName: 'BLANKETT',
    firstName: 'Gisèle',
    birthDate: new Date('1987-08-21'),
    email: 'cblankett8@histats.com'
  },
  {
    id: 'e7b0dbe9-9173-47fb-b953-0468b0e50788',
    familyFileId: 'e7b0dbe9-9173-47fb-b953-0468b0e50788',
    fileNumber: '174b28a6-0743-477d-9a3f-ba59ec7b9354',
    structureId: fixtureStructures[0].id,
    status: 'Active'
  },
  {
    id: '6e3922b5-f8c9-47c4-8522-5b4cba529a13',
    familyFileId: '6e3922b5-f8c9-47c4-8522-5b4cba529a13',
    fileNumber: '6d134b43-4df1-4b58-bff8-27097b9a4ea8',
    structureId: fixtureStructures[0].id,
    status: 'Active',
    title: 'Miss',
    usualName: 'WONFAR',
    birthName: 'RIDEWOOD',
    firstName: 'Lóng',
    gender: 'Female',
    email: 'lridewood0@de.vu'
  },
  {
    id: '732c1aa4-70ed-47d5-85d1-941738ea8d3c',
    familyFileId: '732c1aa4-70ed-47d5-85d1-941738ea8d3c',
    fileNumber: '9230f735-9ede-4ff3-8d4f-8028166086b8',
    structureId: fixtureStructures[0].id,
    status: 'Active',
    title: 'Mister',
    usualName: 'PISCOPO',
    firstName: 'Valérie',
    gender: 'Male'
  },
  {
    id: '5c0f2623-63fb-46c1-ae58-1b4360180a89',
    familyFileId: '5c0f2623-63fb-46c1-ae58-1b4360180a89',
    fileNumber: 'a6228a5a-1f74-42f3-b07a-67767b007579',
    structureId: fixtureStructures[0].id,
    status: 'Active',
    title: 'Mister',
    usualName: 'APFELMANN',
    firstName: 'Aurélie',
    gender: 'Female',
    familySituation: 'Divorced'
  },
  {
    id: '36e4078f-4182-4fb7-a1f5-117a950204b6',
    familyFileId: '36e4078f-4182-4fb7-a1f5-117a950204b6',
    fileNumber: '27d3b839-4547-4477-a177-d2290ac096e9',
    structureId: fixtureStructures[0].id,
    status: 'Deceased',
    title: 'Miss',
    usualName: 'BREITLING',
    firstName: 'Léa',
    deathDate: new Date('2014-06-29'),
    email: 'mpitone3@rambler.ru',
    familySituation: 'CoupleWithChildren'
  },
  {
    id: '69493e7b-dddc-489e-9b0b-a16b4a7c40cd',
    familyFileId: '69493e7b-dddc-489e-9b0b-a16b4a7c40cd',
    fileNumber: '23730994-ef30-41e4-b092-039b983399ca',
    structureId: fixtureStructures[0].id,
    status: 'Inactive',
    usualName: 'HEINIG',
    birthName: 'HUNTON',
    firstName: 'Mélia',
    gender: 'Female'
  },
  {
    id: '960fccab-bf9f-419d-a411-a2b2472c1b64',
    familyFileId: '960fccab-bf9f-419d-a411-a2b2472c1b64',
    fileNumber: '67ff0ec7-80a2-4f1c-8bab-9931ff85dc7d',
    structureId: fixtureStructures[0].id,
    status: 'Active',
    usualName: 'PENBERTHY',
    firstName: 'Léonore',
    birthDate: new Date('1965-10-08'),
    gender: 'Male',
    email: 'rsword6@wp.com'
  },
  {
    id: '0bef7580-29e7-449c-a9a6-1f66ee5e3633',
    familyFileId: '0bef7580-29e7-449c-a9a6-1f66ee5e3633',
    fileNumber: 'a573e400-1b69-4dcd-9186-19754545f440',
    structureId: fixtureStructures[0].id,
    status: 'Active',
    usualName: 'DOWNER',
    firstName: 'Anaé',
    gender: 'Other',
    familySituation: 'Divorced'
  }
] satisfies Prisma.BeneficiaryUncheckedCreateInput[]
