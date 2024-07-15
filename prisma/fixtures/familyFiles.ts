import { Prisma } from '@prisma/client'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '.'

export const fixturesFamilyFiles = [
  {
    id: 'aad15576-27cc-4a75-98f1-cdcb38808b83',
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [{ id: fixturesUsers[FixtureUserRole.StructureManager].id }]
    }
  },
  {
    id: '31152daf-0fdb-4340-aaf1-cbdab1aa1f1a',
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.SocialWorker].id },
        { id: fixturesUsers[FixtureUserRole.ReceptionAgent].id }
      ]
    }
  },
  {
    id: '5a055c3b-9e39-493d-bc4d-c59a0de8947d',
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.StructureManager].id },
        { id: fixturesUsers[FixtureUserRole.Referent].id }
      ]
    }
  },
  {
    id: 'e7b0dbe9-9173-47fb-b953-0468b0e50788',
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [{ id: fixturesUsers[FixtureUserRole.Instructor].id }]
    }
  },
  {
    id: '6e3922b5-f8c9-47c4-8522-5b4cba529a13',
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.Instructor].id },
        { id: fixturesUsers[FixtureUserRole.SocialWorker].id }
      ]
    }
  },
  {
    id: '732c1aa4-70ed-47d5-85d1-941738ea8d3c',
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.StructureManager].id },
        { id: fixturesUsers[FixtureUserRole.Referent].id }
      ]
    }
  },
  {
    id: '5c0f2623-63fb-46c1-ae58-1b4360180a89',
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [{ id: fixturesUsers[FixtureUserRole.SocialWorker].id }]
    }
  },
  {
    id: '36e4078f-4182-4fb7-a1f5-117a950204b6',
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [{ id: fixturesUsers[FixtureUserRole.SocialWorker].id }]
    }
  },
  {
    id: '69493e7b-dddc-489e-9b0b-a16b4a7c40cd',
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.Referent].id },
        { id: fixturesUsers[FixtureUserRole.ReceptionAgent].id }
      ]
    }
  },
  {
    id: '960fccab-bf9f-419d-a411-a2b2472c1b64',
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.Referent].id },
        { id: fixturesUsers[FixtureUserRole.Instructor].id }
      ]
    }
  },
  {
    id: '0bef7580-29e7-449c-a9a6-1f66ee5e3633',
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.StructureManager].id },
        { id: fixturesUsers[FixtureUserRole.Referent].id }
      ]
    }
  },
  {
    id: '86f82368-7c08-403c-b0f2-d2d39d9ae6c3',
    structureId: fixtureStructures[FixtureStructure.Ministère].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.StructureManagerMinistere].id }
      ]
    }
  }
] satisfies Prisma.FamilyFileUncheckedCreateInput[]
