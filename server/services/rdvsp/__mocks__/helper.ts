import { vi } from 'vitest'

export {
  throwIfStructureIsNotSetup,
  getAppointmentRdvspUrl,
  mapRdvspRdvStatusToAppointmentStatus,
  castAppointmentDatestringToUTC,
  findBeneficiaryParticipation,
  getParticipationStatus
} from '../helper'

export const getAgentClient = vi.fn(() => vi.fn())
export const getAgentAuthInfo = vi.fn()
export const refreshAgentToken = vi.fn()
