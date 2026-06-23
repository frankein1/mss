import {
  supportProgramStatus,
  formatSupportProgramDateRange
} from '~/utils/beneficiary/supportProgramStatus'

type SupportProgramForLabel = {
  startDate: Date | null
  endDate: Date | null
  supportProgramName: { name: string }
}

export function formatSupportProgramLabel(
  supportProgram: SupportProgramForLabel
): string {
  const status = supportProgramStatus(supportProgram)
  const datePart = formatSupportProgramDateRange(supportProgram)
  return datePart
    ? `${supportProgram.supportProgramName.name} — ${status} — ${datePart}`
    : `${supportProgram.supportProgramName.name} — ${status}`
}

type SupportProgramOption = {
  id: string
  supportProgramName: { id: string; name: string }
} & SupportProgramForLabel

export function formatSupportProgramOption(
  supportProgram: SupportProgramOption
) {
  return {
    value: supportProgram.id,
    label: formatSupportProgramLabel(supportProgram)
  }
}
