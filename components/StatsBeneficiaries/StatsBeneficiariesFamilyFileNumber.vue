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
  import type { StatFilterInput } from '~/server/schema'

  const props = defineProps<{
    filters: StatFilterInput
    historyType?: 'beneficiary'
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const beneficiaryCount = ref<number | null>(null)
  const familyFileCount = ref<number | undefined>(undefined)

  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getFamilyFileCount.mutate(props.filters)
    if (data == null) {
      throw new Error('no data')
    }
    beneficiaryCount.value = data.beneficiary
    familyFileCount.value = data.family
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }
</script>

<style lang="scss" scoped>
  .feature-section {
    background-image: url('../../assets/icons/users-big-pink.svg');
    background-repeat: no-repeat;
    background-position: right 2rem bottom -2px;
  }

  h2 {
    word-break: normal;
    overflow-wrap: anywhere;
  }
</style>
