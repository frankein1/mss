<template>
  <div class="feature-section fr-p-2w">
    <h4>Nombre de dossiers concernés</h4>
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques du nombre de foyers concernés n'ont pas pu être chargées."
    />
    <template v-else-if="beneficiaryCount !== null">
      <StatsBeneficiaryNumber
        v-if="beneficiaryCount"
        :beneficiary-counts="beneficiaryCount"
        :family-counts="familyFileCount"
        :history-type
      />
      <p v-else>
        Commencez à créer des instructions de dossier dans les fiches de
        bénéficiaires pour voir apparaître les statistiques du nombre de
        bénéficiaires concernés.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import { StatFilterInput } from '~/server/schema'

  const props = defineProps<{
    filters: StatFilterInput
    historyType?: 'beneficiary'
  }>()
  const error = ref<boolean>(false)
  const pending = ref<boolean>(false)
  const beneficiaryCount = ref<number | null>(null)
  const familyFileCount = ref<number | undefined>(undefined)

  onMounted(async () => {
    pending.value = true
    // Do not use useMutation() or useTrpcMutation()
    // it cause issues with response #id matching
    const trpc = useTrpcClient()
    const data = await trpc.stat.getFamilyFileCountPost.mutate(props.filters)
    if (data == null) {
      error.value = true
      return
    }
    beneficiaryCount.value = data.beneficiary
    familyFileCount.value = data.family

    pending.value = false
  })
</script>

<style lang="scss" scoped>
  .feature-section {
    background-image: url('../../assets/icons/users-big-pink.svg');
    background-repeat: no-repeat;
    background-position: right 2rem bottom -2px;
  }

  h2 {
    word-break: break-word;
  }
</style>
