import { MutationLogAction } from '~/types/mutationLogs'

export const mutationLogActionLabels: { [key in MutationLogAction]: string } = {
  [MutationLogAction.Archiving]: 'Archivage',
  [MutationLogAction.Creation]: 'Création'
}
