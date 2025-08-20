<template>
  <div class="feature-section fr-p-2w">
    <h4 class="fr-sr-only">Nombre de bénéficiaires concernés</h4>
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques du nombre de bénéficiaires concernés n'ont pas pu être chargées."
    />
    <template v-else-if="beneficiaryCounts !== null">
      <StatsBeneficiaryNumber
        v-if="beneficiaryCounts"
        :beneficiary-counts
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
    historyType?: 'helprequest'
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const beneficiaryCounts = ref<number | null>(null)
  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getHelpRequestBeneficiaryNumber.mutate(
      props.filters
    )
    if (data == null) {
      throw new Error('no data')
    }
    beneficiaryCounts.value = data
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
    word-break: break-word;
  }
</style>
