import { randomBytes, createHash } from 'node:crypto'
import { minutesToMillis } from '~/utils/time'
import { AuthSessionRepo } from '~~/server/database/repository/AuthSessionRepository'

const SLIDE_THRESHOLD_MINUTES = 30

interface CreateSessionInput {
  userId: string
  userAgent: string | null
  slidingExpiryMinutes: number
}

interface SessionTimeouts {
  slidingExpiryMinutes: number
  absoluteMaxMinutes: number
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function createSession({
  userId,
  userAgent,
  slidingExpiryMinutes
}: CreateSessionInput): Promise<{ sessionId: string; token: string }> {
  const token = randomBytes(32).toString('hex')
  const tokenHash = hashToken(token)

  const session = await AuthSessionRepo.prisma.create({
    data: {
      tokenHash,
      userId,
      expiresAt: new Date(Date.now() + minutesToMillis(slidingExpiryMinutes)),
      userAgent
    },
    select: { id: true }
  })

  return { sessionId: session.id, token }
}

export async function validateSession(
  token: string,
  { slidingExpiryMinutes, absoluteMaxMinutes }: SessionTimeouts
): Promise<{ sessionId: string; userId: string } | null> {
  const tokenHash = hashToken(token)

  const session = await AuthSessionRepo.prisma.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, createdAt: true, expiresAt: true }
  })

  if (!session) {
    return null
  }

  const now = Date.now()
  const absoluteDeadline =
    session.createdAt.getTime() + minutesToMillis(absoluteMaxMinutes)

  if (session.expiresAt.getTime() <= now || absoluteDeadline <= now) {
    await AuthSessionRepo.prisma.delete({ where: { id: session.id } })
    return null
  }

  const remainingMinutes =
    (session.expiresAt.getTime() - now) / minutesToMillis(1)
  if (remainingMinutes < SLIDE_THRESHOLD_MINUTES) {
    const newExpiry = Math.min(
      now + minutesToMillis(slidingExpiryMinutes),
      absoluteDeadline
    )
    if (newExpiry > session.expiresAt.getTime()) {
      // Only update if new expiry has changed i.e. is not equal to absoluteDeadline
      await AuthSessionRepo.prisma.update({
        where: { id: session.id },
        data: { expiresAt: new Date(newExpiry) }
      })
    }
  }

  return { sessionId: session.id, userId: session.userId }
}

export async function deleteSession(sessionId: string): Promise<void> {
  await AuthSessionRepo.prisma.deleteMany({
    where: { id: sessionId }
  })
}
