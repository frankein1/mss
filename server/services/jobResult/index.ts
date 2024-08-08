import { createJob } from './create.service'
import { updateJob } from './update.service'
import { getOngoingJob } from './getOngoing.service'
import { getLastSuccessfullJob } from './getLastSuccessfull.service'

export const JobResultService = {
  create: createJob,
  update: updateJob,
  getOngoingJob,
  getLastSuccessfullJob
}
