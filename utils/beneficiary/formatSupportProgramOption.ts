import {
  supportProgramStatus,
  formatSupportProgramDateRange
} from '~/utils/beneficiary/supportProgramStatus'

type SupportProgramOption = {
  id: string
  startDate: Date | null
  endDate: Date | null
  supportProgramName: { id: string; name: string }
}

export function formatSupportProgramOption(
  supportProgram: SupportProgramOption
) {
  const status = supportProgramStatus(supportProgram)
  const datePart = formatSupportProgramDateRange(supportProgram)
  const label = datePart
    ? `${supportProgram.supportProgramName.name} — ${status} — ${datePart}`
    : `${supportProgram.supportProgramName.name} — ${status}`
  return { value: supportProgram.id, label }
}
