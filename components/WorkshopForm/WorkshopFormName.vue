<template>
  <section
    class="fr-grid-row fr-grid-row--gutters feature-section fr-mb-2w fr-mt-2w"
  >
    <div class="fr-col-12">
      <VeeCombobox
        type="text"
        :label="workshopLabels.name"
        name="name"
        :disabled="isSubmitting"
        required
        :options="options"
        :with-creation="true"
      />
      <WorkshopFormNameHelper v-if="mode != 'duplicate'" />
      <AtomCallout v-else
        >Tous les ateliers avec le même nom seront regroupés dans les
        statistiques.</AtomCallout
      >
    </div>
  </section>
</template>

<script setup lang="ts">
  import { workshopLabels } from '~/client/labels'
  import WorkshopFormNameHelper from '../WorkshopForm/WorkshopFormNameHelper.vue'

  const { data: workshopNames } =
    await useTrpcClient().workshop.getWorkshopNameList.useQuery()

  const options: Ref<Options> = computed(
    () =>
      workshopNames.value?.map(({ name }) => ({ label: name, value: name })) ??
      []
  )

  defineProps<{
    isSubmitting: boolean
    mode: 'update' | 'create' | 'duplicate'
  }>()
</script>
