<template>
  <section
    class="fr-grid-row fr-grid-row--gutters feature-section fr-mb-2w fr-mt-2w"
  >
    <div class="fr-col-12">
      <AtomLazyComponent
        :error="Boolean(error)"
        message="Les éléments pour le changement de nom de l'atelier n'ont pas pu être chargés."
      >
        <VeeCombobox
          type="text"
          :label="workshopLabels.name"
          name="name"
          :disabled="isSubmitting"
          required
          with-creation
          :options
        />

        <VeeRadioButtons
          name="mode"
          label="Modifier le nom :"
          required
          :disabled="!isModified"
          :inline="false"
          :options="[
            {
              label: 'de cet atelier uniquement',
              value: UpdateWorkshopNameMode.current
            },
            {
              label: 'de tous les ateliers ayant ce nom',
              value: UpdateWorkshopNameMode.all
            }
          ]"
        >
        </VeeRadioButtons>
        <WorkshopFormNameHelper />
      </AtomLazyComponent>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { workshopLabels } from '~/client/labels'
  import WorkshopFormNameHelper from './WorkshopFormNameHelper.vue'
  import { UpdateWorkshopNameMode } from '~/utils/constants/workshop'

  const { isSubmitting } = defineProps<{
    isSubmitting: boolean
  }>()

  const { data: workshopNames, error } =
    await useTrpcClient().workshop.getWorkshopNameList.useQuery()

  // Only the name field and not the id field is used in the combobox with-creation
  const options =
    workshopNames.value?.map(({ name }) => ({
      label: name,
      value: name
    })) ?? []

  const {
    value: workshopName,
    meta: { initialValue: initialWorkshopName }
  } = useField<string | null | undefined>('name')

  const isModified = computed(() => workshopName.value !== initialWorkshopName)
</script>

<style scoped>
  .title-wrapper {
    display: flex;
    justify-content: space-between;
  }
</style>
