// import { ExportFollowupsInput } from '~/server/schema'
// import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'

export const exportFollowupsHandler = async () =>
  // {
  //   input,
  //   ctx: { user }
  // }: {
  //   input: ExportFollowupsInput
  //   ctx: ProtectedAppContext
  // }
  {
    // TODO: request followups using order, all fields, and handle permissions
    // Example data:
    const columns = [
      { key: 'test1', header: 'Test 1' },
      { key: 'test2', header: 'Test 2' }
    ]
    const data = [
      { test1: 'ABC', test2: '123' },
      { test1: 'DEF', test2: '456' }
    ]
    return await createExport('Entretiens', columns, data)
  }
