import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'
import { formatDate } from '~/utils/formatDate'

/** CSV reference template for export tests
 * Contains placeholder for created date since it depends on the date of the seed
 */
export async function parseCsvReference(date: Date, pathfile: string) {
  const csvContent = await readFile(path.join(cwd(), pathfile), 'utf-8')
  return csvContent.replaceAll(
    'DD/MM/YYYY HH:mm',
    formatDate(date, 'DD/MM/YYYY HH:mm')
  )
}
