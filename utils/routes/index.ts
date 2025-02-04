import { routes as admin } from './admin'
import {
  routes as auth,
  apiInclusionConnectRoutes,
  apiProConnectRoutes,
  apiRdvspRoutes
} from './auth'
import { routes as beneficiary } from './beneficiary'
import { routes as budget } from './budget'
import { routes as cgu } from './cgu'
import { routes as error } from './error'
import { routes as file } from './file'
import { routes as followup } from './followup'
import { routes as helpRequest } from './help-request'
import { routes as landing } from './landing'
import { routes as stats } from './stats'
import { routes as structure } from './structure'
import { routes as user } from './user'
import { routes as rdvsp } from './rdvsp'

export const routes = {
  admin,
  auth,
  beneficiary,
  budget,
  cgu,
  error,
  file,
  followup,
  helpRequest,
  landing,
  structure,
  stats,
  user,
  rdvsp
}

export const apiRoutes = {
  inclusionConnect: apiInclusionConnectRoutes,
  proConnect: apiProConnectRoutes,
  rdvsp: apiRdvspRoutes
}

export type { AppBeneficiaryEditRoute } from './beneficiary'
