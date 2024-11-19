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
  <template v-else-if="stats && stats.length">
    <StatsList
      :stats
      :stats-percentage="false"
      unit="€"
    />
  </template>
  <p v-else>
    Aucune demande d'aide financière accordée n'a été enregistrée pour le
    moment.
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
