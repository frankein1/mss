import dayjs from 'dayjs'
import { formatDate } from '~/utils/formatDate'

export type SupportProgramStatusLabel = 'À venir' | 'En cours' | 'Terminé'

type SupportProgramDates = {
  startDate: Date | null
  endDate: Date | null
}

export function supportProgramStatus(
  program: SupportProgramDates
): SupportProgramStatusLabel {
  // On the model of formatDate, user input dates are compared in utc format
  const today = dayjs().utc().startOf('day')
  if (program.startDate && dayjs(program.startDate).utc().isAfter(today)) {
    return 'À venir'
  }
  if (!program.endDate || dayjs(program.endDate).utc().isSameOrAfter(today)) {
    return 'En cours'
  }
  return 'Terminé'
}

export function formatSupportProgramDateRange(
  program: SupportProgramDates
): string {
  if (!program.startDate && !program.endDate) {
    return ''
  }
  const start = program.startDate
    ? formatDate(program.startDate)
    : '(date non définie)'
  const end = program.endDate
    ? ` → ${formatDate(program.endDate)}`
    : " → (aujourd'hui)"
  return `${start}${end}`
}
