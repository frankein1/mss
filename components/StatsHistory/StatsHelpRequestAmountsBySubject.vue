<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    :message="`Les statistiques de la répartition des montants accordés par organisme instructeur n'ont pas pu être chargées.`"
  />
  <template v-else-if="amounts">
    <StatsList
      :stats
      stats-bar
      :stats-percentage="false"
      unit="€"
      :display-total="false"
    />
  </template>
  <p v-else>
    Commencez à créer des instructions de dossier dans les fiches de
    bénéficiaires pour voir apparaître les statistiques du nombre de
    bénéficiaires concernés.
  </p>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors'

  const trpcClient = useTrpcClient()

  const props = defineProps<{ filters: StatFilterInput }>()

  const {
    data: amounts,
    error,
    pending
  } = await trpcClient.stat.getHelpRequestAmountsBySubject.useQuery(
    props.filters
  )

  const stats = computed(() =>
    (amounts.value || []).map(amount => ({
      ...amount,
      color: SupportColor.helpRequests
    }))
  )
</script>
