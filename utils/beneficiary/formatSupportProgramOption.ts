import { formatDate } from '~/utils/formatDate'

type SupportProgramOption = {
  id: string
  startDate: Date | null
  endDate: Date | null
  supportProgramName: { id: string; name: string }
}

export function formatSupportProgramOption(
  supportProgram: SupportProgramOption
) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const status =
    supportProgram.startDate && new Date(supportProgram.startDate) > today
      ? 'À venir'
      : !supportProgram.endDate || new Date(supportProgram.endDate) >= today
        ? 'En cours'
        : 'Terminé'
  const start = supportProgram.startDate
    ? formatDate(supportProgram.startDate)
    : ''
  const end = supportProgram.endDate
    ? ` → ${formatDate(supportProgram.endDate)}`
    : ' →'
  const datePart = start ? `${start}${end}` : ''
  const label = datePart
    ? `${supportProgram.supportProgramName.name} — ${status} — ${datePart}`
    : `${supportProgram.supportProgramName.name} — ${status}`
  return { value: supportProgram.id, label }
}
