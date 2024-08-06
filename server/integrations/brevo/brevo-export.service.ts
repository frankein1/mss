import { JobStatus, Structure, User } from '@prisma/client'
import { JobResultRepo, UserRepo } from '~/server/database'
import { brevoClient } from '~/server/lib'
import { formatDate } from '~/utils/formatDate'

const JOB_NAME = 'brevo-export'

async function exportContacts() {
  const startDate = new Date()

  const job = await getOrCreateJob()
  if (job.status === JobStatus.Ongoing) {
    return
  }

  const users = await getUsers(job.startDate)
  if (users.length == 0) {
    return
  }

  await JobResultRepo.prisma.update({
    where: {
      id: job.id
    },
    data: {
      status: JobStatus.Ongoing
    }
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
        await JobResultRepo.prisma.update({
          where: {
            id: job.id
          },
          data: {
            startDate,
            endDate: new Date(),
            errors: {},
            status: JobStatus.Success,
            result: { processId: data.body.processId }
          }
        })
      },
      async function (error) {
        await JobResultRepo.prisma.update({
          where: {
            id: job.id
          },
          data: {
            endDate: null,
            errors: error.body,
            status: JobStatus.Failure
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

async function getOrCreateJob() {
  let job = await JobResultRepo.prisma.findFirst({
    where: {
      name: JOB_NAME
    },
    select: {
      id: true,
      startDate: true,
      status: true
    }
  })
  if (!job) {
    job = await JobResultRepo.prisma.create({
      data: {
        name: JOB_NAME,
        startDate: new Date(0)
      },
      select: {
        id: true,
        startDate: true,
        status: true
      }
    })
  }
  return job
}
