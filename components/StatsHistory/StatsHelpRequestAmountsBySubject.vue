<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    :message="`Les statistiques de la répartition des montants accordés par objet d'accompagnement n'ont pas pu être chargées.`"
  />
  <template v-else-if="stats && stats.length">
    <StatsList
      :stats
      :to-fixed="2"
      :stats-percentage="false"
      :sub-count-label="helpRequestFieldLabels.askedAmount"
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
  import type { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors'
  import { helpRequestFieldLabels } from '~/client/labels'

  const props = defineProps<{ filters: StatFilterInput }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getHelpRequestAmountsBySubject.useQuery(
      toRef(() => props.filters)
    )

  const stats = computed(() =>
    (data.value || []).map(amount => ({
      ...amount,
      color: SupportColor.helpRequests
    }))
  )
</script>
