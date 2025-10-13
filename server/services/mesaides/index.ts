//import { fetchBenefits } from './planAppointment.service'


async function fetchBenefits():Promise<
  { slug: string }
> {
  const response = await fetch("http://localhost:8080/api/benefits")
  const payload = await response.json()

  return { slug: payload[0].slug }
}

export const MesAidesService = {
  planAppointment,
  getAppointments,
  validateDraftAppointmentsForFamilyFile
}
