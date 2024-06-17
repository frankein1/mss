import { defineEventHandler, readBody } from 'h3'
import { SocialSupportRepo } from '~/server/database'
// import { prismaClient } from '~/server/prisma'
import { forbiddenError } from '~/server/trpc'
import { JwtUser } from '~/types/user'

async function getFileInstructionsWithoutSubject(user: JwtUser) {
  return await SocialSupportRepo.findMany(user, {
    where: {
      socialSupportType: 'HelpRequest',
      subjects: { none: {} }
    },
    select: {
      id: true,
      created: true,
      updated: true,
      fileInstruction: {
        select: {
          id: true,
          helpRequest: {
            select: {
              id: true,
              subjectId: true
            }
          }
        }
      }
    }
  })
}

type FileInstructionsWithoutSubjects = Awaited<
  ReturnType<typeof getFileInstructionsWithoutSubject>
>

// async function matchFileInstructionsWithUserActivities(
//   fileInstructions: FileInstructionsWithoutSubjects
// ) {
//   const promises = fileInstructions.map(async fi => {
//     const linkedUserActivities = await prismaClient.userActivity.findMany({
//       where: {
//         objectId: fi.fileInstruction?.helpRequest?.id || ''
//       },
//       select: {
//         date: true,
//         activity: true,
//         content: true
//       },
//       orderBy: {
//         date: 'desc'
//       }
//     })

//     return linkedUserActivities.map(ua => ({
//       sid: fi.id,
//       fid: fi.fileInstruction?.id,
//       hid: fi.fileInstruction?.helpRequest?.id,
//       date: ua.date,
//       activity: ua.activity,
//       created: fi.created,
//       updated: fi.updated,
//       subjectIdFromHelpRequest: fi.fileInstruction?.helpRequest?.subjectId,
//       typeId: (ua.content as any)?.typeId,
//       subjectId: (ua.content as any)?.subjectId
//     }))
//   })

//   return await Promise.all(promises)
// }

export default defineEventHandler(async event => {
  const { user }: { user: JwtUser } = event.context.auth
  if (!user || user.role !== 'Administrator') {
    throw forbiddenError()
  }

  const { exec } = await readBody(event)
  // console.log(exec)

  const withoutSubject = await getFileInstructionsWithoutSubject(user)

  // console.log('number of social support without subject', withoutSubject.length)

  // const instructions =
  //   await matchFileInstructionsWithUserActivities(withoutSubject)

  // console.log(JSON.stringify(instructions, undefined, 2))

  const notfound: FileInstructionsWithoutSubjects = []

  await Promise.all(
    withoutSubject.map(async instruction => {
      // const latestUpdateWithSubjectId = instruction.find(
      //   ua => ua.typeId || ua.subjectId
      // )

      const noSubjectIdToRecuperate =
        !!instruction.fileInstruction?.helpRequest?.subjectId

      if (!noSubjectIdToRecuperate) {
        notfound.push(instruction)
        return
      }

      // const subjectId =
      //   latestUpdateWithSubjectId.subjectId || latestUpdateWithSubjectId.typeId

      const subjectId = instruction.fileInstruction?.helpRequest
        ?.subjectId as string

      // console.log(
      //   'update',
      //   JSON.stringify(latestUpdateWithSubjectId, undefined, 2)
      // )

      if (exec) {
        await SocialSupportRepo.update(user, {
          where: { id: instruction.id },
          data: {
            subjects: {
              connect: { id: subjectId }
            }
          }
        })
      }
    })
  )

  // if (notfound.length > 0) {
  //   console.log(JSON.stringify(notfound, undefined, 2))
  // }

  return {
    recuperationFailure: notfound,
    nToRecuperate: withoutSubject.length
  }
})
