<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppBeneficiariesAdd()" />
    <PageTitle :title="title">
      <div>
        Les champs avec <span class="color-red">*</span> sont obligatoires
      </div>
    </PageTitle>
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
            :tax-households="[]"
            :entourages="[]"
            :current-beneficiary-id="null"
            :can-set-external-organisations="canSetExternalOrganisations"
            :can-set-health="canSetHealth"
            :can-set-occupation-income="canSetOccupationIncome"
            :can-set-referents="canSetReferents"
            :can-set-relatives="canSetRelatives"
            @save-beneficiary="onSaveBeneficiary"
          />
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { BeneficiaryStatus } from '@prisma/client'
  import { SaveBeneficiaryInput, saveBeneficiarySchema } from 'server/schema'
  import { canSaveBeneficiaryWithCompleteInfo } from 'server/security/rules'
  import { useAuthStore } from 'store/auth'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { RoutePath, Breadcrumb, RouteTitle } from '~/utils/routing'

  const title = RouteTitle.AppBeneficiariesAdd()

  useHead({ title })

  const trpcClient = useTrpcClient()
  const { matomo } = useMatomo()

  const { data: agents } = await trpcClient.config.getAgents.useQuery()

  const isSubmitting = ref(false)

  const authStore = useAuthStore()

  const user = authStore.getAuthUser

  const beneficiary = computed(() => {
    return saveBeneficiarySchema.parse({
      structureId: user.structureId,
      referents: [],
      aidantConnectAuthorized: false,
      // General Info
      general: {
        status: BeneficiaryStatus.Active,
        firstName: '',
        usualName: '',
        birthName: '',
        birthPlace: '',
        numeroPegase: ''
      }
    })
  })

  const canSetRelatives = computed(() =>
    canSaveBeneficiaryWithCompleteInfo(user)
  )
  const canSetReferents = computed(() =>
    canSaveBeneficiaryWithCompleteInfo(user)
  )
  const canSetHealth = computed(() => canSaveBeneficiaryWithCompleteInfo(user))
  const canSetOccupationIncome = computed(() =>
    canSaveBeneficiaryWithCompleteInfo(user)
  )
  const canSetExternalOrganisations = computed(() =>
    canSaveBeneficiaryWithCompleteInfo(user)
  )

  async function onSaveBeneficiary(beneficiary: SaveBeneficiaryInput) {
    isSubmitting.value = true
    // TODO: handle error
    const { id } = await trpcClient.beneficiary.save.mutate({
      ...beneficiary
    })
    isSubmitting.value = false

    matomo.trackEvent(
      EventCategory.CreateBeneficiary,
      CreateBeneficiaryEventAction.SaveCompleteForm
    )

    navigateTo(RoutePath.AppBeneficiary(id))
  }
</script>
