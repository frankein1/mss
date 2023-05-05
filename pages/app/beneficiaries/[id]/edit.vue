<template>
  <div class="fr-container fr-p-5w">
    <TheHeader
      :title="title"
      :back-link="`${Routes.Beneficiaries}/${beneficiaryId}`"
    />
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
            @save-beneficiary="onUpdateBeneficiary"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Beneficiary } from '@prisma/client'
  import { Routes } from '~/utils/routing/routes'

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const { data } =
    await useTrpcClient().beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const { data: agents } = await useTrpcClient().config.getAgents.useQuery()

  const beneficiary = computed(() => data.value?.beneficiary)
  const taxHouseholds = computed(() => data.value?.taxHouseholds || [])
  const entourages = computed(() => data.value?.taxHouseholds || [])

  const title = computed(() =>
    beneficiary.value
      ? `Modifier ${getBeneficiaryDisplayName(beneficiary.value)}`
      : ''
  )

  const isSubmitting = false

  // const canAccessRelatives = computed(() => permissionsStore.canAccessRelatives)

  function onUpdateBeneficiary(beneficiary: Beneficiary) {
    console.log(beneficiary)
    // isSubmitting.value = true
    // try {
    //   const res = await $updateItem(
    //     `beneficiary`,
    //     beneficiary.value,
    //     _beneficiary
    //   )
    //   if (res.status === 200) return navigateTo(beneficiaryPath.value)
    //   throw new Error(errorResponseMessage(res))
    // } catch {
    //   $snackbar.error('La mise à jour du bénéficiaire a échoué.', () =>
    //     formContainer.value?.querySelector('input')?.focus()
    //   )
    // }
    // isSubmitting.value = false
  }
</script>
