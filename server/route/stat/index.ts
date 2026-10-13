import * as b from './beneficiary'
import * as h from './helpRequest'
import * as f from './followup'
import * as g from './get-history-count.query'
import * as workshopStatRoutes from './workshop'
import * as supportProgramStatRoutes from './supportProgram'

export const statRoutes = {
  ...b,
  ...h,
  ...f,
  ...g,
  ...workshopStatRoutes,
  ...supportProgramStatRoutes
}
