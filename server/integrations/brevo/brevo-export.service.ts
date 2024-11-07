import { JobStatus, Structure, User } from '@prisma/client'
import { UserRepo } from '~/server/database'
import { brevoClient } from '~/server/lib'
import { JobResultService } from '~/server/services'
import { formatDate } from '~/utils/formatDate'

const JOB_NAME = 'brevo-export'

async function exportContacts(all: boolean) {
  const ongoing = await JobResultService.getOngoingJob()
  if (ongoing) {
    return
  }

  const job = await JobResultService.create({
    name: JOB_NAME,
    errors: [],
    result: { exportStartDate: null, nImported: 0, processId: null }
  })

  // Export all data except if a former successful job exists AND it is specified to export only new data
  let startDate = new Date(0)

  const lastJob = await JobResultService.getLastSuccessfulJob(JOB_NAME)
  if (lastJob && !all) {
    startDate = lastJob.startDate
  }

  const users = await getUsers(startDate)
  if (users.length === 0) {
    await JobResultService.update({
      id: job.id,
      endDate: new Date(),
      status: JobStatus.Success,
      errors: [],
      result: { exportStartDate: startDate, nImported: 0, processId: null }
    })
    return
  }

  await JobResultService.update({
    ...job,
    status: JobStatus.Ongoing
  })

  const jsonBody = buildJson(users)

  brevoClient
    .getContactsApi()
    .importContacts({
      jsonBody,
      listIds: [10],
      emailBlacklist: false,
      smsBlacklist: false,
      updateExistingContacts: true,
      emptyContactsAttributes: true
    })
    .then(
      async function (data) {
        await JobResultService.update({
          id: job.id,
          endDate: new Date(),
          status: JobStatus.Success,
          errors: [],
          result: {
            exportStartDate: startDate,
            nImported: users.length,
            processId: data.body.processId
          }
        })
      },
      async function (error) {
        await JobResultService.update({
          id: job.id,
          status: JobStatus.Failure,
          endDate: new Date(),
          errors: [{ category: JOB_NAME, error: `${error}`, status: null }],
          result: { nImported: 0, exportStartDate: startDate, processId: null }
        })
      }
    )
}

export const BrevoIntegrationService = {
  exportContacts
}

function buildJson(
  users: (User & {
    structure: (Structure & { _count: { socialSupports: number } }) | null
  } & {
    _count: { createdSocialSupports: number }
  })[]
) {
  return users.map(
    ({
      email,
      id,
      firstName,
      lastName,
      role,
      structure,
      created,
      firstAccess,
      lastAccess,
      _count: { createdSocialSupports }
    }) => ({
      email,
      attributes: {
        EXT_ID: id,
        PRENOM: firstName,
        NOM: lastName,
        ROLE: role,
        TYPE_STRUCTURE: structure?.type || '',
        SIRET_STRUCTURE: structure?.siret || '',
        NOM_STRUCTURE: structure?.name || '',
        DERNIERE_CONNEXION_STRUCTURE: formatDate(
          structure?.lastAccess,
          'DD-MM-YYYY'
        ),
        STRUCTURE_AVEC_1_SUIVI:
          (structure?._count.socialSupports || 0) > 0 ? 'Yes' : 'No',
        CREATION_DATE: formatDate(created, 'DD-MM-YYYY'),
        PREMIERE_CONNEXION: formatDate(firstAccess, 'DD-MM-YYYY'),
        DERNIERE_CONNEXION: formatDate(lastAccess, 'DD-MM-YYYY'),
        UTILISATEUR_AVEC_1_SUIVI: createdSocialSupports > 0 ? 'Yes' : 'No'
      }
    })
  )
}

async function getUsers(date: Date) {
  const users = await UserRepo.prisma.findMany({
    where: {
      OR: [
        {
          created: {
            gte: date
          }
        },
        {
          updated: {
            gte: date
          }
        }
      ]
    },
    include: {
      structure: {
        include: {
          _count: {
            select: {
              socialSupports: true
            }
          }
        }
      },
      _count: {
        select: {
          createdSocialSupports: true
        }
      }
    }
  })
  return users
}
