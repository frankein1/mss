<template>
  <section
    class="fr-grid-row fr-grid-row--gutters feature-section fr-mb-2w fr-mt-2w"
  >
    <div class="fr-col-12">
      <h2 class="fr-text--sm fr-text--bold text--uppercase fr-mb-1v">
        Informations pratiques
      </h2>
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        type="date"
        :label="workshopLabels.date"
        name="date"
        :disabled="isSubmitting"
        required
      />
    </div>
    <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
      <VeeSelect
        :label="workshopLabels.startTime"
        name="startTime"
        :disabled="isSubmitting"
        :options="withEmptyValue(startTimeKeys, '')"
        @change-value="onChangeStart($event)"
      />
    </div>
    <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
      <VeeSelect
        :label="workshopLabels.endTime"
        name="endTime"
        :disabled="isSubmitting"
        :options="withEmptyValue(endTimeKeys, '')"
      />
    </div>

    <div class="fr-col-12">
      <VeeInput
        type="text"
        :label="workshopLabels.location"
        name="location"
        :disabled="isSubmitting"
      />
    </div>
    <div class="fr-col-12">
      <VeeCombobox
        class="fr-mb-1w"
        :label="workshopLabels.partnerOrganizationId"
        placeholder="Rechercher un organisme"
        name="partnerOrganizationId"
        :options="withEmptyValue(partnerOrganizationOptions)"
        :disabled="isSubmitting"
      />
      <NuxtLink
        :to="routes.structure.AppPartners.path()"
        class="fr-link fr-icon-info-fill fr-link--icon-left"
      >
        Données issues de l'annuaire de partenaires
      </NuxtLink>
    </div>
    <div class="fr-col-12">
      <VeeInput
        type="text"
        :label="workshopLabels.host"
        name="host"
        :disabled="isSubmitting"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { workshopLabels } from '~~/client/labels'
  import { routes } from '~/utils/routes'
  import { timeGroup } from '~~/client/options'

  const trpcClient = useTrpcClient()

  const startTimeKeys = ref(
    timeGroup.map(time => ({ label: time, value: time }))
  )

  // Get partners organisations
  const { data: partnerOrganizations } =
    await trpcClient.partner.getAll.useQuery()

  const calculateTimeValue = (startValue: string) => {
    const index = timeGroup.findIndex(time => time === startValue)
    return timeGroup
      .slice(index + 1)
      .map(time => ({ label: time, value: time }))
  }
  const initialStartValue = useField<string>('startTime').value
  const endTimeKeys = ref(calculateTimeValue(initialStartValue.value))

  const onChangeStart = (startValue: string) => {
    endTimeKeys.value = calculateTimeValue(startValue)
  }

  defineProps<{
    isSubmitting: boolean
  }>()

  const partnerOrganizationOptions = computed(() => {
    const partnerOrganizationsWithStringId = (
      partnerOrganizations.value ?? []
    ).map(({ id, ...rest }) => ({
      id: String(id),
      ...rest
    }))
    return toOptions(partnerOrganizationsWithStringId, 'id', 'name')
  })
</script>
