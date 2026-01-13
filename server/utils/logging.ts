import type { Prisma } from '@prisma/client'

type LogFeature = 'prisma' | 'trpc' | 'rdvsp'

export function shouldLog(logFeature: LogFeature) {
  if (process.env.NODE_ENV === 'production') {
    return false
  }
  const logFeatures = process.env.LOG?.split(',')
  return logFeatures?.includes(logFeature)
}

export function formatPrismaQueryLog(event: Prisma.QueryEvent): string {
  const params = JSON.parse(event.params)
  return event.query
    .replace(/\$(\d+)/g, (_match, group) => {
      const idx = parseInt(group, 10) - 1
      let value = params[idx]

      // Handle undefined or missing parameters
      if (value === undefined) {
        return 'NULL'
      }

      // Properly quote strings for SQL
      if (typeof value === 'string') {
        // Escape single quotes for SQL
        value = value.replace(/'/g, "''")
        return `'${value}'`
      }
      // Convert other types to string
      return String(value)
    })
    .replaceAll('"', '')
    .replaceAll('public.', '')
}
