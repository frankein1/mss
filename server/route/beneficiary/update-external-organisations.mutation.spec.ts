import { BeneficiaryOrientationType } from '@prisma/client'
import { afterEach, beforeEach, describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole,
  fixturesPartnerOrganizations,
  FixturePartnerOrganization,
  fixturesPartnerOrganizationContacts
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'

const structureId = fixtureStructures[FixtureStructure.Test].id
const socialWorkerId = fixturesUsers[FixtureUserRole.SocialWorker].id
const referentId = fixturesUsers[FixtureUserRole.Referent].id

const orgCAF = fixturesPartnerOrganizations[FixturePartnerOrganization.CAF26]
const orgFT =
  fixturesPartnerOrganizations[FixturePartnerOrganization.FranceTravail]
const contactSandrine = fixturesPartnerOrganizationContacts[0]

let familyFileId: string
let beneficiaryId: string

beforeEach(async () => {
  const familyFile = await prismaClient.familyFile.create({
    data: {
      structure: { connect: { id: structureId } },
      referents: { connect: [{ id: referentId }] }
    }
  })
  familyFileId = familyFile.id

  const beneficiary = await prismaClient.beneficiary.create({
    data: {
      familyFile: { connect: { id: familyFileId } },
      structure: { connect: { id: structureId } },
      createdBy: { connect: { id: socialWorkerId } },
      fileNumber: 'UEXO-001',
      status: 'Active',
      prescribingStructure: 'Ancien organisme',
      involvedPartners: 'Anciens partenaires',
      serviceProviders: 'Anciens prestataires',
      orientationType: BeneficiaryOrientationType.Tiers,
      orientationStructure: 'Ancien organisme orientation'
    }
  })
  beneficiaryId = beneficiary.id
})

afterEach(async () => {
  await prismaClient.beneficiaryContributingPartner.deleteMany({
    where: { beneficiaryId }
  })
  await prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId } })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
  await prismaClient.partnerOrganization.deleteMany({
    where: { name: { startsWith: 'UEXO-' } }
  })
})

const baseInput = () => ({
  id: beneficiaryId,
  protectionMeasure: null,
  representative: null,
  prescribingOrganizationId: null,
  prescribingOrganizationContactId: null,
  contributingPartners: []
})

describe('Beneficiary - Update external organisations - Authorizations', () => {
  test('A manager can update external organisations with a prescribing organisation from their structure', async ({
    trpc
  }) => {
    const result =
      await trpc.structureManager.beneficiary.updateExternalOrganisations({
        ...baseInput(),
        prescribingOrganizationId: orgCAF.id,
        prescribingOrganizationContactId: contactSandrine.id
      })
    expect(result.id).toBe(beneficiaryId)
  })

  test('A manager cannot update external organisations with a prescribing organisation from another structure', async ({
    trpc
  }) => {
    const otherOrg = await prismaClient.partnerOrganization.create({
      data: {
        structureId: fixtureStructures[FixtureStructure.Autun].id,
        name: 'UEXO-Org Autun'
      },
      select: { id: true }
    })

    await expect(
      trpc.structureManager.beneficiary.updateExternalOrganisations({
        ...baseInput(),
        prescribingOrganizationId: otherOrg.id
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A manager cannot update external organisations with a prescribing organisation contact from another structure', async ({
    trpc
  }) => {
    const otherOrg = await prismaClient.partnerOrganization.create({
      data: {
        structureId: fixtureStructures[FixtureStructure.Autun].id,
        name: 'UEXO-Org Autun Contact'
      }
    })
    const otherContact = await prismaClient.partnerOrganizationContact.create({
      data: {
        name: 'UEXO-Contact Autun',
        partnerId: otherOrg.id
      },
      select: { id: true }
    })

    await expect(
      trpc.structureManager.beneficiary.updateExternalOrganisations({
        ...baseInput(),
        prescribingOrganizationId: orgCAF.id,
        prescribingOrganizationContactId: otherContact.id
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A manager cannot update external organisations with a contributing partner organisation from another structure', async ({
    trpc
  }) => {
    const otherOrg = await prismaClient.partnerOrganization.create({
      data: {
        structureId: fixtureStructures[FixtureStructure.Autun].id,
        name: 'UEXO-Org Autun CP'
      },
      select: { id: true }
    })

    await expect(
      trpc.structureManager.beneficiary.updateExternalOrganisations({
        ...baseInput(),
        contributingPartners: [{ partnerOrganizationId: otherOrg.id }]
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A manager cannot update external organisations with a contributing partner contact from another structure', async ({
    trpc
  }) => {
    const otherOrg = await prismaClient.partnerOrganization.create({
      data: {
        structureId: fixtureStructures[FixtureStructure.Autun].id,
        name: 'UEXO-Org Autun CPContact'
      }
    })
    const otherContact = await prismaClient.partnerOrganizationContact.create({
      data: {
        name: 'UEXO-Contact Autun CP',
        partnerId: otherOrg.id
      },
      select: { id: true }
    })

    await expect(
      trpc.structureManager.beneficiary.updateExternalOrganisations({
        ...baseInput(),
        contributingPartners: [
          {
            partnerOrganizationId: orgCAF.id,
            partnerOrganizationContactId: otherContact.id
          }
        ]
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })
})

describe('Beneficiary - Update external organisations - Prescribing organisation', () => {
  test('Setting a prescribing organisation nulls the legacy prescribingStructure field', async ({
    trpc
  }) => {
    await trpc.structureManager.beneficiary.updateExternalOrganisations({
      ...baseInput(),
      prescribingOrganizationId: orgCAF.id
    })

    const ben = await prismaClient.beneficiary.findUniqueOrThrow({
      where: { id: beneficiaryId },
      select: {
        prescribingOrganizationId: true,
        prescribingStructure: true
      }
    })
    expect(ben.prescribingOrganizationId).toBe(orgCAF.id)
    expect(ben.prescribingStructure).toBeNull()
  })

  test('Clearing the prescribing organisation does not restore the legacy field', async ({
    trpc
  }) => {
    await trpc.structureManager.beneficiary.updateExternalOrganisations({
      ...baseInput(),
      prescribingOrganizationId: orgCAF.id
    })

    await trpc.structureManager.beneficiary.updateExternalOrganisations({
      ...baseInput(),
      prescribingOrganizationId: null
    })

    const ben = await prismaClient.beneficiary.findUniqueOrThrow({
      where: { id: beneficiaryId },
      select: {
        prescribingOrganizationId: true,
        prescribingStructure: true
      }
    })
    expect(ben.prescribingOrganizationId).toBeNull()
    expect(ben.prescribingStructure).toBeNull()
  })

  test('Setting a prescribing organisation with a contact persists both', async ({
    trpc
  }) => {
    await trpc.structureManager.beneficiary.updateExternalOrganisations({
      ...baseInput(),
      prescribingOrganizationId: orgCAF.id,
      prescribingOrganizationContactId: contactSandrine.id
    })

    const ben = await prismaClient.beneficiary.findUniqueOrThrow({
      where: { id: beneficiaryId },
      select: {
        prescribingOrganizationId: true,
        prescribingOrganizationContactId: true
      }
    })
    expect(ben.prescribingOrganizationId).toBe(orgCAF.id)
    expect(ben.prescribingOrganizationContactId).toBe(contactSandrine.id)
  })
})

describe('Beneficiary - Update external organisations - Contributing partners', () => {
  test('Adding contributing partners to a beneficiary that had none', async ({
    trpc
  }) => {
    await trpc.structureManager.beneficiary.updateExternalOrganisations({
      ...baseInput(),
      contributingPartners: [
        {
          partnerOrganizationId: orgCAF.id,
          partnerOrganizationContactId: contactSandrine.id,
          precisions: 'Suivi budgétaire'
        },
        {
          partnerOrganizationId: orgFT.id,
          precisions: 'Accompagnement emploi'
        }
      ]
    })

    const partners = await prismaClient.beneficiaryContributingPartner.findMany(
      {
        where: { beneficiaryId },
        orderBy: { partnerOrganization: { name: 'asc' } }
      }
    )
    expect(partners).toHaveLength(2)
    expect(partners[0]!.partnerOrganizationId).toBe(orgCAF.id)
    expect(partners[0]!.partnerOrganizationContactId).toBe(contactSandrine.id)
    expect(partners[0]!.precisions).toBe('Suivi budgétaire')
    expect(partners[1]!.partnerOrganizationId).toBe(orgFT.id)
    expect(partners[1]!.precisions).toBe('Accompagnement emploi')
  })

  test('Adding the first contributing partner nulls legacy involvedPartners and serviceProviders', async ({
    trpc
  }) => {
    await trpc.structureManager.beneficiary.updateExternalOrganisations({
      ...baseInput(),
      contributingPartners: [{ partnerOrganizationId: orgCAF.id }]
    })

    const ben = await prismaClient.beneficiary.findUniqueOrThrow({
      where: { id: beneficiaryId },
      select: { involvedPartners: true, serviceProviders: true }
    })
    expect(ben.involvedPartners).toBeNull()
    expect(ben.serviceProviders).toBeNull()
  })

  test('Modifying existing contributing partners updates precisions and contact', async ({
    trpc
  }) => {
    await trpc.structureManager.beneficiary.updateExternalOrganisations({
      ...baseInput(),
      contributingPartners: [
        {
          partnerOrganizationId: orgCAF.id,
          precisions: 'Initial'
        }
      ]
    })

    const allCreated =
      await prismaClient.beneficiaryContributingPartner.findMany({
        where: { beneficiaryId }
      })
    const created = allCreated[0]!

    await trpc.structureManager.beneficiary.updateExternalOrganisations({
      ...baseInput(),
      contributingPartners: [
        {
          id: created.id,
          partnerOrganizationId: orgCAF.id,
          partnerOrganizationContactId: contactSandrine.id,
          precisions: 'Updated'
        }
      ]
    })

    const updated =
      await prismaClient.beneficiaryContributingPartner.findUniqueOrThrow({
        where: { id: created.id }
      })
    expect(updated.precisions).toBe('Updated')
    expect(updated.partnerOrganizationContactId).toBe(contactSandrine.id)
  })

  test('Removing all contributing partners from a beneficiary', async ({
    trpc
  }) => {
    await trpc.structureManager.beneficiary.updateExternalOrganisations({
      ...baseInput(),
      contributingPartners: [{ partnerOrganizationId: orgCAF.id }]
    })

    await trpc.structureManager.beneficiary.updateExternalOrganisations({
      ...baseInput(),
      contributingPartners: []
    })

    const count = await prismaClient.beneficiaryContributingPartner.count({
      where: { beneficiaryId }
    })
    expect(count).toBe(0)
  })

  test('Adding a contributing partner when some already exist does not re-null legacy fields', async ({
    trpc
  }) => {
    await trpc.structureManager.beneficiary.updateExternalOrganisations({
      ...baseInput(),
      contributingPartners: [{ partnerOrganizationId: orgCAF.id }]
    })

    await prismaClient.beneficiary.update({
      where: { id: beneficiaryId },
      data: {
        involvedPartners: 'Restored manually',
        serviceProviders: 'Restored manually'
      }
    })

    const allExisting =
      await prismaClient.beneficiaryContributingPartner.findMany({
        where: { beneficiaryId }
      })
    const existing = allExisting[0]!

    await trpc.structureManager.beneficiary.updateExternalOrganisations({
      ...baseInput(),
      contributingPartners: [
        { id: existing.id, partnerOrganizationId: orgCAF.id },
        { partnerOrganizationId: orgFT.id }
      ]
    })

    const ben = await prismaClient.beneficiary.findUniqueOrThrow({
      where: { id: beneficiaryId },
      select: { involvedPartners: true, serviceProviders: true }
    })
    expect(ben.involvedPartners).toBe('Restored manually')
    expect(ben.serviceProviders).toBe('Restored manually')
  })
})

describe('Beneficiary - Update external organisations - Legacy field preservation', () => {
  test('orientationType and orientationStructure are never nulled regardless of updates', async ({
    trpc
  }) => {
    await trpc.structureManager.beneficiary.updateExternalOrganisations({
      ...baseInput(),
      prescribingOrganizationId: orgCAF.id,
      contributingPartners: [{ partnerOrganizationId: orgFT.id }]
    })

    const ben = await prismaClient.beneficiary.findUniqueOrThrow({
      where: { id: beneficiaryId },
      select: { orientationType: true, orientationStructure: true }
    })
    expect(ben.orientationType).toBe('Tiers')
    expect(ben.orientationStructure).toBe('Ancien organisme orientation')
  })
})
