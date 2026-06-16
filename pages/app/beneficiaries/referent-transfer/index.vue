<template>
  <PageContainer no-max-width>
    <AtomAlert
      v-if="!application.edit.beneficiary.referent"
      :alert-type="AlertType.Error"
      message="La modification des agents référents n'est pas autorisée."
    />
    <template v-else>
      <AtomBreadcrumb
        :links="breadcrumbs.beneficiary.AppBeneficiariesReferentTransfer()"
      />
      <PageTitle
        class="title"
        no-margin
        :title="title"
      />
      <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
        <div class="fr-col-12">
          <section class="feature-section">
            <AtomStepper
              :steps
              :current-step
            />
          </section>
        </div>
        <!-- STEP 1 -->
        <div
          v-if="currentStep === 1 && agentOptions"
          class="fr-col-12"
        >
          <section class="feature-section fr-pt-6v">
            <MassReferentTransferEditionChoice @next="currentStep = 2" />
          </section>
        </div>

        <!-- STEP 2 -->
        <div
          v-if="currentStep === 2"
          class="fr-col-12"
        >
          <h2 class="fr-sr-only">Filtres</h2>
          <section class="feature-section beneficiary-filters">
            <BeneficiaryFilters @filter="filters = $event" />
          </section>
          <section class="feature-section fr-mt-2w">
            <MassReferentTransferBeneficiariesChoice
              :filters="filters"
              @previous="currentStep = 1"
              @next="currentStep = 3"
            />
          </section>
        </div>

        <!-- STEP 3 -->
        <div
          v-if="currentStep === 3 && agentOptions"
          class="fr-col-12"
        >
          <section class="feature-section fr-mt-2w">
            <MassReferentTransferAddReferentForm
              :agent-options="agentOptions"
              @previous="currentStep = 2"
              @next="currentStep = 4"
            />
          </section>
        </div>

        <!-- STEP 4 -->
        <div
          v-if="currentStep === 4"
          class="fr-col-12"
        >
          <section class="feature-section fr-mt-2w">
            <MassReferentTransferConfirmation
              :agent-options="agentOptions"
              @previous="currentStep = 3"
            />
          </section>
        </div>
      </div>
    </template>
  </PageContainer>
</template>

<script lang="ts" setup>
  import type { BeneficiaryFilterInput } from '~/server/schema'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { AlertType } from '~/utils/constants/alert'

  const title = routes.beneficiary.AppBeneficiariesReferentTransfer.title

  useHead({ title })

  definePageMeta({
    name: routes.beneficiary.AppBeneficiariesReferentTransfer.name
  })

  const filtersState = useFilters()
  const trpcClient = useTrpcClient()
  const { application } = usePermissions()

  // Filters
  const filters = ref<BeneficiaryFilterInput>(
    filtersState.beneficiary.value || {}
  )
  const currentStep = ref(1)

  // Steps
  const steps = [
    'Sélectionner le type de modification',
    'Sélectionner les dossiers bénéficiaires à mettre à jour',
    'Sélectionner l’agent référent',
    'Confirmation'
  ]

  // Get agents list
  const { data: agentOptions } = await trpcClient.config.getAgents.useQuery(
    undefined,
    {
      transform: agents => toOptions(agents, 'id', 'name'),
      queryKey: 'config.getAgents.options'
    }
  )
</script>

<style lang="scss" scoped>
  /* stylelint-disable selector-class-pattern */
  .beneficiary-filters {
    :deep(.fromAge),
    :deep(.toAge) {
      .fr-input-wrap::before {
        bottom: 0.75rem;
        margin: auto;
        pointer-events: none;
        position: absolute;
        right: 1.75rem;
        top: 0.75rem;
        content: 'an(s)';
        line-height: 1rem;
      }

      .fr-input {
        padding-right: 4rem;
      }
    }
  }
  /* stylelint-enable selector-class-pattern */
</style>
