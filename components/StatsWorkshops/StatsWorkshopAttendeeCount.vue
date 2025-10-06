<template>
  <div class="feature-section fr-p-6v">
    <AtomLoader
      v-if="pending"
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
  import { WorkshopAttendeeListType } from '@prisma/client'

  const props = defineProps<{
    filters: WorkshopStatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const mainAttendeeCount = ref<number | null>(null)
  const waitingAttendeeCount = ref<number | null>(null)
  const trpc = useTrpcClient()

  watchEffect(async () => {
    try {
      const data = await trpc.stat.getWorkshopAttendeeCountStats.mutate(
        props.filters
      )
      if (data == null) {
        throw new Error('no data')
      }
      mainAttendeeCount.value =
        data.find(item => item.listType === WorkshopAttendeeListType.Main)
          ?._count ?? 0
      waitingAttendeeCount.value =
        data.find(item => item.listType === WorkshopAttendeeListType.Waiting)
          ?._count ?? 0
    } catch (err: unknown) {
      console.error(err)
      error.value = err as Error
    } finally {
      pending.value = false
    }
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
