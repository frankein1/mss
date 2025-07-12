import { defineEventHandler, readBody } from 'h3'
import { prismaClient } from '~/server/prisma'
import { forbiddenError } from '~/server/trpc'
import { JwtUser } from '~/types/user'
import dayjs from 'dayjs'
import { performance } from 'node:perf_hooks'
import { logger } from '~/server/plugins/logger'

function modifyDate(date: Date | null) {
  return date ? dayjs(date).subtract(1, 'day').toDate() : null
}

/** Select all beneficiaries from structure */
async function getBeneficiaries(structureId: string) {
  const bens = await prismaClient.beneficiary.findMany({
    where: { structureId },
    select: {
      id: true,
      birthDate: true,
      deathDate: true,
      weddingDate: true,
      divorceDate: true,
      relatives: {
        select: {
          id: true,
          birthDate: true
        }
      },
      socialSupports: {
        select: {
          id: true,
          date: true,
          dueDate: true,
          fileInstruction: {
            select: {
              id: true,
              dispatchDate: true,
              examinationDate: true,
              decisionDate: true,
              helpRequest: {
                select: { id: true, paymentDate: true, handlingDate: true }
              },
              housingHelpRequest: {
                select: { id: true, firstOpeningDate: true }
              }
            }
          }
        }
      }
    }
  })
  return bens
}

type BeneficiariesQueryResult = Awaited<ReturnType<typeof getBeneficiaries>>

/** Remove one day to all dates in beneficiary and associated social supports */
function updateDatesForBeneficiaries(
  bens: BeneficiariesQueryResult
): BeneficiariesQueryResult {
  const bensupdated = bens.map(b => {
    return {
      id: b.id,
      birthDate: modifyDate(b.birthDate),
      deathDate: modifyDate(b.deathDate),
      weddingDate: modifyDate(b.weddingDate),
      divorceDate: modifyDate(b.divorceDate),

      relatives: b.relatives.map(r => {
        return {
          id: r.id,
          birthDate: modifyDate(r.birthDate)
        }
      }),

      socialSupports: b.socialSupports.map(ss => {
        return {
          id: ss.id,
          date: modifyDate(ss.date) as Date,
          dueDate: modifyDate(ss.dueDate),

          fileInstruction: ss.fileInstruction
            ? {
                id: ss.fileInstruction.id,
                dispatchDate: modifyDate(ss.fileInstruction.dispatchDate),
                examinationDate: modifyDate(ss.fileInstruction.examinationDate),
                decisionDate: modifyDate(ss.fileInstruction.decisionDate),

                helpRequest: ss.fileInstruction.helpRequest
                  ? {
                      id: ss.fileInstruction.helpRequest.id,
                      paymentDate: modifyDate(
                        ss.fileInstruction.helpRequest.paymentDate
                      ),
                      handlingDate: modifyDate(
                        ss.fileInstruction.helpRequest.handlingDate
                      )
                    }
                  : null,

                housingHelpRequest: ss.fileInstruction.housingHelpRequest
                  ? {
                      id: ss.fileInstruction.housingHelpRequest.id,
                      firstOpeningDate: modifyDate(
                        ss.fileInstruction.housingHelpRequest.firstOpeningDate
                      )
                    }
                  : null
              }
            : null
        }
      })
    }
  })

  return bensupdated
}

// Needs to be in a transaction to rollback all in case of failure
// because operation not idempotent
async function updateInDbForAllFields(bens: BeneficiariesQueryResult) {
  const start = performance.now()
  for (let bid = 0; bid < bens.length; bid++) {
    try {
      await prismaClient.$transaction(
        async _tx => {
          const { id, socialSupports, relatives, ...ben } = bens[bid]

          await prismaClient.beneficiary.update({ where: { id }, data: ben })

          for (let rid = 0; rid < relatives.length; rid++) {
            const { id, ...r } = relatives[rid]
            await prismaClient.beneficiaryRelative.update({
              where: { id },
              data: r
            })
          }

          for (let sid = 0; sid < socialSupports.length; sid++) {
            const { id, fileInstruction, ...ss } = socialSupports[sid]

            await prismaClient.socialSupport.update({ where: { id }, data: ss })

            if (fileInstruction) {
              const { id, housingHelpRequest, helpRequest, ...fi } =
                fileInstruction

              if (housingHelpRequest) {
                const { id: _hhrid, ...hhr } = housingHelpRequest
                await prismaClient.fileInstruction.update({
                  where: { id },
                  data: { ...fi, housingHelpRequest: { update: hhr } }
                })
              } else if (helpRequest) {
                const { id: _hrid, ...hr } = helpRequest
                await prismaClient.fileInstruction.update({
                  where: { id },
                  data: { ...fi, helpRequest: { update: hr } }
                })
              }
            }
          }
        },
        { timeout: 5_000 }
      )
    } catch (e) {
      logger.verbose(
        `could not update updateInDbForBirthDateAndSocialSupportOpeningDate for beneficiary ${bens[bid].id}`,
        e
      )
    }
  }
  const end = performance.now()
  logger.verbose(` duration ${(end - start) / 1000} for updateInDbForAllFields`)
}

// Needs to be in a transaction to rollback all in case of failure
// because operation not idempotent
async function updateInDbForBirthDateAndSocialSupportOpeningDate(
  bens: BeneficiariesQueryResult
) {
  const start = performance.now()
  for (let bid = 0; bid < bens.length; bid++) {
    try {
      await prismaClient.$transaction(
        async _tx => {
          const { id, socialSupports, relatives, ...ben } = bens[bid]

          await prismaClient.beneficiary.update({
            where: { id },
            data: {
              birthDate: ben.birthDate
            }
          })

          for (let rid = 0; rid < relatives.length; rid++) {
            const { id, ...r } = relatives[rid]
            await prismaClient.beneficiaryRelative.update({
              where: { id },
              data: { birthDate: r.birthDate }
            })
          }

          for (let sid = 0; sid < socialSupports.length; sid++) {
            const { id, fileInstruction, ...ss } = socialSupports[sid]

            await prismaClient.socialSupport.update({
              where: { id },
              data: { date: ss.date }
            })
          }
        },
        { timeout: 5_000 }
      )
    } catch (e) {
      logger.verbose(
        `could not update updateInDbForBirthDateAndSocialSupportOpeningDate for beneficiary ${bens[bid].id}`,
        e
      )
    }
  }
  const end = performance.now()
  logger.verbose(
    ` duration ${(end - start) / 1000} for updateInDbForBirthDateAndSocialSupportOpeningDate`
  )
}

// Needs to be in a transaction to rollback all in case of failure
// because operation not idempotent
async function updateInDbForBirthDate(bens: BeneficiariesQueryResult) {
  const start = performance.now()
  for (let bid = 0; bid < bens.length; bid++) {
    try {
      await prismaClient.$transaction(
        async _tx => {
          const { id, socialSupports, relatives, ...ben } = bens[bid]

          await prismaClient.beneficiary.update({
            where: { id },
            data: {
              birthDate: ben.birthDate
            }
          })

          for (let rid = 0; rid < relatives.length; rid++) {
            const { id, ...r } = relatives[rid]
            await prismaClient.beneficiaryRelative.update({
              where: { id },
              data: { birthDate: r.birthDate }
            })
          }
        },
        { timeout: 5_000 }
      )
    } catch (e) {
      logger.verbose(
        `could not update updateInDbForBirthDate for beneficiary ${bens[bid].id}`,
        e
      )
    }
  }
  const end = performance.now()
  logger.verbose(` duration ${(end - start) / 1000} for updateInDbForBirthDate`)
}

export default defineEventHandler(async event => {
  const { user }: { user: JwtUser } = event.context.auth
  if (!user || user.role !== 'Administrator') {
    throw forbiddenError()
  }

  const {
    structureId,
    migrateAll,
    migrateBirthDate,
    migrateBirthDateAndFileOpeningDate
  } = await readBody(event)

  logger.verbose(
    structureId,
    migrateAll,
    migrateBirthDate,
    migrateBirthDateAndFileOpeningDate
  )

  // fetch all bens with info on relatives and social supports
  const bens = await getBeneficiaries(structureId)

  // update the dates if exist (if not keep null)
  const bensWithDatesUpdated = updateDatesForBeneficiaries(bens)

  // update all bens and related quantities in DB
  if (migrateAll) {
    await updateInDbForAllFields(bensWithDatesUpdated)
  } else if (migrateBirthDateAndFileOpeningDate) {
    await updateInDbForBirthDateAndSocialSupportOpeningDate(
      bensWithDatesUpdated
    )
  } else if (migrateBirthDate) {
    await updateInDbForBirthDate(bensWithDatesUpdated)
  }

  return
})
