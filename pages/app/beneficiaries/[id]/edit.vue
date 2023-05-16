<template>
  <div class="fr-container fr-p-5w">
    <TheHeader
      :title="title"
      :back-link="`${Routes.Beneficiary(beneficiaryId)}`"
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
  import { UpdateBeneficiaryInput } from '~/server/schema'
  import { Routes } from '~/utils/routing/routes'

  const route = useRoute()
  const beneficiaryId = route.params.id as string
  const trpcClient = useTrpcClient()

  const { data } = await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
    id: beneficiaryId
  })

  const { data: agents } = await trpcClient.config.getAgents.useQuery()

  const isSubmitting = ref(false)

  const beneficiary = computed(() => data.value?.beneficiary)
  const taxHouseholds = computed(() => data.value?.taxHouseholds || [])
  const entourages = computed(() => data.value?.entourages || [])

  const title = computed(() =>
    beneficiary.value
      ? `Modifier ${getBeneficiaryDisplayName(beneficiary.value)}`
      : ''
  )

  async function onUpdateBeneficiary(beneficiary: UpdateBeneficiaryInput) {
    isSubmitting.value = true
    // TODO: handle error
    await trpcClient.beneficiary.update.mutate(beneficiary)
    isSubmitting.value = false

    navigateTo(`${Routes.Beneficiary(beneficiary.id)}`)
  }
</script>
