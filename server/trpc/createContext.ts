import type { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'
import { UserRepo } from '~/server/database'

export const structureContextQuery = () => ({
  // FIXME: move 'externalRdvspActive' to the token
  select: { id: true, type: true, externalRdvspActive: true }
})

export const userContextQuery = () => ({
  select: { id: true, role: true, status: true }
})

export const createContext = async (event: H3Event) => {
  const authUser = event.context.auth?.user

  if (!authUser) {
    return { event }
  }

  try {
    // FIXME: remove this call & retrieve info directly from the token
    const user = await UserRepo.prisma.findUniqueOrThrow({
      where: { id: authUser.id },
      select: {
        ...userContextQuery().select,
        structure: structureContextQuery()
      }
    })

    return { event, user }
  } catch {
    return { event, user: null }
  }
}

export type AppContext = inferAsyncReturnType<typeof createContext>
