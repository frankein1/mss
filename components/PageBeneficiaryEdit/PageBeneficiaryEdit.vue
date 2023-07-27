<template>
  <PageContainer>
    <DsfrBreadcrumb
      :links="Breadcrumb.AppBeneficiaryEdit(authStore.userRole, beneficiary)"
    />
    <PageTitle :title="RouteTitle.AppBeneficiaryEdit(beneficiary)" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main
          ref="formContainer"
          class="main-container fr-p-5w"
        >
          <BeneficiaryForm
            v-if="beneficiary && agents?.length"
            :beneficiary="beneficiary"
            :agents="agents"
            :is-submitting="isSubmitting"
            :tax-households="taxHouseholds"
            :entourages="entourages"
            :can-set-relatives="canSetRelatives"
            :can-set-referents="canSetReferents"
            :can-set-health="canSetHealth"
            :can-set-occupation-income="canSetOccupationIncome"
            :can-set-external-organisations="canSetExternalOrganisations"
            @save-beneficiary="onUpdateBeneficiary"
          />
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { BeneficiaryRelative } from '@prisma/client'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { UpdateBeneficiaryInput } from '~/server/schema'
  import { RoutePath, Breadcrumb, RouteTitle } from '~/utils/routing'
  import { GetBeneficiaryOutput } from 'server/routers'
  import { BeneficiaryRelativeWithLinkedBeneficiary } from 'types/relative'
  import { useAuthStore } from '~/store/auth'

  defineProps<{
    beneficiary: GetBeneficiaryOutput
    taxHouseholds: BeneficiaryRelativeWithLinkedBeneficiary[]
    entourages: BeneficiaryRelative[]
    canSetRelatives?: boolean
    canSetReferents?: boolean
    canSetHealth?: boolean
    canSetOccupationIncome?: boolean
    canSetExternalOrganisations?: boolean
  }>()

  const route = useRoute()
  const trpcClient = useTrpcClient()
  const { matomo } = useMatomo()
  const authStore = useAuthStore()

  const { data: agents } = await trpcClient.config.getAgents.useQuery()

  const isSubmitting = ref(false)

  async function onUpdateBeneficiary(beneficiary: UpdateBeneficiaryInput) {
    isSubmitting.value = true
    // TODO: handle error
    await trpcClient.beneficiary.update.mutate(beneficiary)
    isSubmitting.value = false

    if (route.params.complete) {
      matomo.trackEvent(
        EventCategory.CreateBeneficiary,
        CreateBeneficiaryEventAction.SaveCompleteForm
      )
    }

    navigateTo(RoutePath.AppBeneficiary(beneficiary.id))
  }
</script>
