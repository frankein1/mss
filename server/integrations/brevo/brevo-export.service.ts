import { JobStatus, Structure, User } from '@prisma/client'
import { UserRepo } from '~/server/database'
import { brevoClient } from '~/server/lib'
import { JobResultService } from '~/server/services'
import { formatDate } from '~/utils/formatDate'

const JOB_NAME = 'brevo-export'

async function exportContacts() {
  const ongoing = await JobResultService.getOngoingJob()
  if (ongoing) {
    return
  }

  const job = await JobResultService.create({
    name: JOB_NAME,
    errors: [],
    result: {
      nTotal: 0,
      nInDatabase: 0,
      nImported: 0,
      nCreated: 0,
      nUpdated: 0
    }
  })

  let startDate = new Date(0)

  const lastJob = await JobResultService.getLastSuccessfullJob(JOB_NAME)
  if (lastJob) {
    startDate = lastJob.startDate
  }

  const users = await getUsers(startDate)
  if (users.length === 0) {
    return
  }

  await JobResultService.update({
    ...job,
    status: JobStatus.Ongoing
  })

  const jsonBody = buildJson(users)

  brevoClient.contactsApi
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
            nTotal: users.length,
            nInDatabase: 0,
            nImported: 0,
            nCreated: 0,
            nUpdated: 0,
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
          result: {
            nTotal: 0,
            nInDatabase: 0,
            nImported: 0,
            nCreated: 0,
            nUpdated: 0
          }
        })
      }
    )
}

export const BrevoIntegrationService = {
  exportContacts
}

function buildJson(users: (User & { structure: Structure | null })[]) {
  return users.map(
    ({
      email,
      id,
      firstName,
      lastName,
      role,
      structure,
      created,
      lastAccess
    }) => ({
      email,
      attributes: {
        EXT_ID: id,
        PRENOM: firstName,
        NOM: lastName,
        ROLE: role,
        TYPE_STRUCTURE: structure?.type || '',
        CREATION_DATE: formatDate(created, 'DD-MM-YYYY'),
        DERNIERE_CONNEXION: formatDate(lastAccess, 'DD-MM-YYYY')
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
      structure: true
    }
  })
  return users
}
