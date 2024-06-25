import { defineEventHandler, readBody } from 'h3'
import { Prisma } from '@prisma/client'
import { SocialSupportRepo } from '~/server/database'
import { prismaClient } from '~/server/prisma'
import { forbiddenError } from '~/server/trpc'
import { JwtUser } from '~/types/user'

async function getFileInstructionsWithSeveralSubjects() {
  return await prismaClient.$queryRaw<
    Array<{ sid: string; count: number }>
  >(Prisma.sql`
WITH with_type AS (select ss.id as sid
FROM social_support ss
JOIN _social_support_to_followup_type as sst
ON ss.id = sst."A"
WHERE social_support_type = 'HelpRequest'
),
counts AS (select sid,count(*) as count
FROM with_type
GROUP BY sid
)
SELECT sid,count
FROM counts
WHERE count > 1;
`)
}

export default defineEventHandler(async event => {
  const { user }: { user: JwtUser } = event.context.auth
  if (!user || user.role !== 'Administrator') {
    throw forbiddenError()
  }

  const { exec } = await readBody(event)
  // console.log(exec)

  const sevSubject = await getFileInstructionsWithSeveralSubjects()

  // console.log('number of social support without subject', sevSubject)

  const notfound: any[] = []

  await Promise.all(
    sevSubject.map(async ({ sid }) => {
      const instruction = await SocialSupportRepo.findUniqueOrThrow(user, {
        where: { id: sid },
        select: {
          subjects: {
            select: { id: true }
          },
          fileInstruction: {
            select: {
              helpRequest: {
                select: {
                  subjectId: true
                }
              }
            }
          }
        }
      })

      const hasSubjectId = !!instruction.fileInstruction?.helpRequest?.subjectId

      if (!hasSubjectId) {
        notfound.push(instruction)
        return
      }

      const subjectId = instruction.fileInstruction?.helpRequest
        ?.subjectId as string

      const subjectsToDisconnect = (instruction.subjects || [])
        .filter(sub => sub.id !== subjectId)
        .map(sub => ({ id: sub.id }))

      // console.log(
      //   'update',
      //   sid,
      //   subjectId,
      //   'count',
      //   count.toString(),
      //   'to disconnect',
      //   subjectsToDisconnect
      // )

      if (exec) {
        await SocialSupportRepo.update(user, {
          where: { id: sid },
          data: {
            subjects: {
              disconnect: subjectsToDisconnect
            }
          }
        })
      }
    })
  )

  return {
    recuperationFailure: notfound,
    nToRecuperate: sevSubject.length
  }
})
