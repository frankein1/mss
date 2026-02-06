import { prismaClient } from '~/server/prisma'

export default defineEventHandler(async () => {
  let status = 'OK'
  let error
  try {
    await prismaClient.$queryRaw`SELECT 1`
  } catch (e: any) {
    status = 'ERROR'
    error = e.message
  }

  const healthcheck: {
    status: string
    error?: string
  } = {
    status
  }

  if (error) {
    healthcheck.error = error
    // eslint-disable-next-line no-console
    console.error('[health-check] database connection failed')
  } else {
    // eslint-disable-next-line no-console
    console.log('[health-check] status OK')
  }

  return healthcheck
})
