<template>
  <BeneficiaryEditFormLayout
    :family-file-id="beneficiary?.familyFileId || ''"
    :family-identification="familyIdentification"
    :beneficiary-identification="beneficiaryIdentification"
    :binded-values="bindedValues"
    :permissions="permissions"
    :schema="updateBeneficiarySupportProgramsSchema"
    :is-submitting="status === 'pending'"
    :current-route="routes.beneficiary.AppBeneficiaryEditSupportPrograms.name"
    :small-title="true"
    :title-icon="getFormIcon(familyIdentification.length)"
    @save="onSaveBeneficiary"
  >
    <AtomLazyComponent
      :pending
      :error="Boolean(errorFetch)"
      message="Les informations du bénéficiaire n'ont pas pu être chargées."
    >
      <section
        v-if="bindedValues"
        class="fr-p-3v"
      >
        <h2 class="title-blue fr-mb-6v">
          {{ routes.beneficiary.AppBeneficiaryEditSupportPrograms.title }}
        </h2>
        <BeneficiaryFormSupportPrograms />
      </section>
    </AtomLazyComponent>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import type { UpdateBeneficiarySupportProgramsInput } from '~~/server/schema'
  import { updateBeneficiarySupportProgramsSchema } from '~~/server/schema'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const {
    beneficiary,
    permissions,
    beneficiaryIdentification,
    familyIdentification,
    pending,
    error: errorFetch
  } = await useBeneficiaryDetails(beneficiaryId)

  const bindedValues = computed(() => {
    if (!beneficiary.value) {
      return null
    }

    const { id, supportPrograms } = beneficiary.value

    return {
      id,
      supportPrograms: (supportPrograms ?? []).map(d => ({
        id: d.id,
        supportProgramNameId: d.supportProgramName.id,
        startDate: d.startDate,
        endDate: d.endDate,
        partnerOrganisationIds: d.partnerOrganisations?.map(o => o.id) ?? [],
        outcome: d.outcome ?? null,
        exitReason: d.exitReason
      }))
    }
  })

  const router = trpcClient.beneficiary
  const { mutate, error, status } = router.updateSupportPrograms.useMutation()

  async function onSaveBeneficiary(
    ben: UpdateBeneficiarySupportProgramsInput,
    target: string | undefined
  ) {
    if (!beneficiary.value) {
      return
    }

    const updated = await mutate(ben)

    if (error.value || !updated) {
      snackbar.error(
        'La mise à jour de la fiche bénéficiaire a échoué.',
        snackbar.focus('.actions-bar', "button[type='submit']" as FocusHTMLTag)
      )
      return
    }

    navigateTo(target)
  }

  definePageMeta({
    layout: 'second-navigation'
  })
</script>
