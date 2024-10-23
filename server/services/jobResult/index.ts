import { createJob } from './create.service'
import { updateJob } from './update.service'
import { getOngoingJob } from './getOngoing.service'
import { getLastSuccessfulJob } from './getLastSuccessful.service'

export const JobResultService = {
  create: createJob,
  update: updateJob,
  getOngoingJob,
  getLastSuccessfulJob
}
