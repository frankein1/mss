import { createQuery, createMutation } from '~/server/route'
import { prefillSimulationSchema, PrefillSimulationInput } from '~/server/schema/mesAides.schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { MesAidesService } from '~/server/services'

const securityCheck = AllowSecurityCheck

const handler = ({
  input,
  ctx
}: {
  input: PrefillSimulationInput
  ctx: ProtectedAppContext
}) =>
  MesAidesService.prefillSimulation(ctx, input)

export const prefillSimulation = createMutation({
  inputValidation: prefillSimulationSchema,
  handler: handler,
  securityCheck,
})
