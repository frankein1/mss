<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des thématiques d'instruction n'ont pas pu être chargées."
  />
  <template v-else-if="subjectStats.length">
    <p class="fr-text--xs text--muted">
      Les instructions de dossiers de demande de logement réalisées avant le 15
      février 2024 sont comptabilisées dans la thématique "Autre".
    </p>
    <StatsPie
      pie-label="Répartion des thématiques d'instruction"
      :stats="subjectStats"
      :total-count="totalCount"
    />
  </template>
  <p v-else>
    Commencez à créer des instructions de dossier dans les fiches de
    bénéficiaires pour voir apparaître les statistiques de la répartition des
    thématiques d'instruction.
  </p>
</template>

<script lang="ts" setup>
  import { FileInstructionType } from '@prisma/client'
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import {
    fileInstructionTypePictos,
    fileInstructionTypeFilterKeys
  } from '~/client/options'
  import { ChartColor } from '~/utils/color/chartColors'
  import { useLoadStatisticsWithPost } from '~/composables/useLoadStatisticsWithPost'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: subjectCounts,
    error,
    pending
  } = await useLoadStatisticsWithPost(
    'getFileInstructionTypeStats',
    toRef(props.filters)
  )

  const subjectStats = computed(
    () =>
      subjectCounts.value?.map(({ _count, subject }) => ({
        key: subject,
        label: fileInstructionTypeFilterKeys.value(subject) || '',
        color: getColor(subject),
        count: _count,
        picto: fileInstructionTypePictos[subject]
      })) || []
  )

  function getColor(subject: FileInstructionType) {
    if (subject === FileInstructionType.Housing) {
      return ChartColor.LightBlue
    }
    if (subject === FileInstructionType.Financial) {
      return ChartColor.Peach
    }
    if (subject === FileInstructionType.Other) {
      return ChartColor.Yellow
    }
    return ChartColor.Gray
  }
</script>
