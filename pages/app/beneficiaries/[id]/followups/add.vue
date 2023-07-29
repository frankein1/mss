<template>
  <PageContainer>
    <DsfrBreadcrumb
      :links="Breadcrumb.AppBeneficiaryFollowupAdd(beneficiary)"
    />
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main
          ref="formContainer"
          class="main-container fr-p-5w"
        >
          <AtomAlert
            v-if="fetchError"
            :alert-type="AlertType.Error"
            :message="fetchError"
          />

          <AtomLoader
            v-if="pending"
            class="fr-mx-auto"
          />
          <FollowupFormCreation
            v-else-if="followupTypes && prescribingOrganizations"
            :is-submitting="isSubmitting"
            :followup-types="followupTypes"
            :beneficiary-id="beneficiaryId"
            :prescribing-organizations="prescribingOrganizations"
            @save-followup="onAddFollowup"
          />
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, Breadcrumb, RouteTitle } from '~/utils/routing'
  import { AddFollowupInput } from '~/server/schema/followup.schema'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'

  definePageMeta({
    middleware: 'is-beneficiary-referent'
  })

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const route = useRoute()

  const isSubmitting = ref<boolean>(false)
  const formContainer = ref<HTMLElement | null>(null)

  const beneficiaryId = route.params.id as string

  const { data: beneficiary, error: beneficiaryError } =
    await trpcClient.beneficiary.getBeneficiaryMinimalInfo.useQuery({
      id: beneficiaryId
    })

  const title = computed(() =>
    RouteTitle.AppBeneficiaryFollowupAdd(beneficiary.value || null)
  )

  useHead({ title })

  const {
    data: followupTypes,
    pending: followupTypesPending,
    error: followupTypesError
  } = await trpcClient.config.getStructureFollowupTypes.useQuery()

  const {
    data: prescribingOrganizations,
    pending: prescribingOrganizationsPending,
    error: prescribingOrganizationsError
  } = await trpcClient.config.getPrescribingOrganizations.useQuery()

  const pending = computed(
    () => followupTypesPending.value || prescribingOrganizationsPending.value
  )

  const fetchError = computed(() => {
    if (beneficiaryError.value) {
      return "Les informations du bénéficiaire n'ont pas pu être chargées."
    }
    if (followupTypesError.value) {
      return "La liste des types d'accompagnement de votre structure n'a pas pu être chargée."
    }
    if (prescribingOrganizationsError.value) {
      return "La liste des organismes prescripteurs de votre structure n'a pas pu être chargée."
    }
    return ''
  })

  async function onAddFollowup(followup: AddFollowupInput) {
    isSubmitting.value = true
    try {
      await trpcClient.followup.add.mutate(followup)
      navigateTo(
        RoutePath.AppBeneficiary(beneficiaryId, {
          tab: BeneficiaryTab.History
        })
      )
    } catch {
      snackbar.error(
        "La création de la synthèse d'entretien a échoué.",
        () => formContainer.value?.querySelector('input')?.focus()
      )
    }
    isSubmitting.value = false
  }
</script>
