<template>
  <div class="feature-section fr-p-6v">
    <AtomLoader
      v-if="status === 'pending'"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques du nombre de participants aux ateliers n'ont pas pu être chargées."
    />
    <p
      v-else
      class="fr-mb-0"
    >
      <span class="title-blue fr-h1">{{ mainAttendeeCount }}&nbsp;</span>
      <span class="fr-h5">inscriptions&nbsp;+&nbsp;</span>
      <span class="title-blue fr-h4">{{ waitingAttendeeCount }}&nbsp;</span>
      <strong>sur liste d‘attente</strong>
    </p>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import type { WorkshopStatFilterInput } from '~/server/schema'
  import { WorkshopAttendeeListType } from '~/prisma/generated/client'

  const props = defineProps<{
    filters: WorkshopStatFilterInput
  }>()
  const trpc = useTrpcClient()
  const { data, status, error } =
    await trpc.stat.getWorkshopAttendeeCountStats.useQuery(
      toRef(() => props.filters)
    )

  const mainAttendeeCount = computed(() => {
    return (
      data.value?.find(item => item.listType === WorkshopAttendeeListType.Main)
        ?._count ?? 0
    )
  })
  const waitingAttendeeCount = computed(() => {
    return (
      data.value?.find(
        item => item.listType === WorkshopAttendeeListType.Waiting
      )?._count ?? 0
    )
  })
</script>

<style lang="scss" scoped>
  .feature-section {
    background-image: url('../../assets/icons/users-big-blue.svg');
    background-repeat: no-repeat;
    background-position: right 2rem bottom -2px;
  }

  h2 {
    word-break: normal;
    overflow-wrap: anywhere;
  }
</style>
