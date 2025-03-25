import { Prisma } from '@prisma/client'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole,
  FixtureBeneficiary,
  fixturesBeneficiaries
} from '.'

export const fixturesFamilyFiles = [
  {
    id: fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id,
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [{ id: fixturesUsers[FixtureUserRole.StructureManager].id }]
    }
  },
  {
    id: fixturesBeneficiaries[FixtureBeneficiary.PENSON].id,
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.SocialWorker].id },
        { id: fixturesUsers[FixtureUserRole.ReceptionAgent].id }
      ]
    }
  },
  {
    id: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.StructureManager].id },
        { id: fixturesUsers[FixtureUserRole.Referent].id }
      ]
    }
  },
  {
    id: fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id,
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [{ id: fixturesUsers[FixtureUserRole.Instructor].id }]
    }
  },
  {
    id: fixturesBeneficiaries[FixtureBeneficiary.WONFAR].id,
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.Instructor].id },
        { id: fixturesUsers[FixtureUserRole.SocialWorker].id }
      ]
    }
  },
  {
    id: fixturesBeneficiaries[FixtureBeneficiary.PISCOPO].id,
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.StructureManager].id },
        { id: fixturesUsers[FixtureUserRole.Referent].id }
      ]
    }
  },
  {
    id: fixturesBeneficiaries[FixtureBeneficiary.APFELMANN].id,
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [{ id: fixturesUsers[FixtureUserRole.SocialWorker].id }]
    }
  },
  {
    id: fixturesBeneficiaries[FixtureBeneficiary.BREITLING].id,
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [{ id: fixturesUsers[FixtureUserRole.SocialWorker].id }]
    }
  },
  {
    id: fixturesBeneficiaries[FixtureBeneficiary.HEINIG].id,
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.Referent].id },
        { id: fixturesUsers[FixtureUserRole.ReceptionAgent].id }
      ]
    }
  },
  {
    id: fixturesBeneficiaries[FixtureBeneficiary.PENBERTHY].id,
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.Referent].id },
        { id: fixturesUsers[FixtureUserRole.Instructor].id }
      ]
    }
  },
  {
    id: fixturesBeneficiaries[FixtureBeneficiary.DOWNER].id,
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.StructureManager].id },
        { id: fixturesUsers[FixtureUserRole.Referent].id }
      ]
    }
  },
  {
    id: fixturesBeneficiaries[FixtureBeneficiary.MARTIN].id,
    structureId: fixtureStructures[FixtureStructure.Ministère].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.StructureManagerMinistere].id }
      ]
    }
  },
  {
    id: fixturesBeneficiaries[FixtureBeneficiary.INACTIVE].id,
    structureId: fixtureStructures[0].id,
    referents: {
      connect: [
        { id: fixturesUsers[FixtureUserRole.StructureManager].id },
        { id: fixturesUsers[FixtureUserRole.Referent].id },
        { id: fixturesUsers[FixtureUserRole.ReceptionAgent].id },
        { id: fixturesUsers[FixtureUserRole.Instructor].id }
      ]
    },
    budget: {
      create: {
        created: new Date('2021-01-01'),
        updated: new Date('2021-01-01')
      }
    }
  }
] satisfies Prisma.FamilyFileUncheckedCreateInput[]
