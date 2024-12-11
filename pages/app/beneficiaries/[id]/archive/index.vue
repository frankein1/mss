<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <PageContainer
    v-else
    class="max-width"
  >
    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="Le dossier n'a pas pu être chargé."
    />

    <AtomBreadcrumb
      v-if="familyFileId && familyIdentification"
      :links="
        breadcrumbs.beneficiary.AppBeneficiaryArchive(
          beneficiaryIdentification,
          familyFileId,
          familyIdentification
        )
      "
    />

    <template v-else-if="beneficiary?.id && beneficiaryIdentification">
      <PageTitle title="Gérer le dossier" />

      <!-- TODO : composant 1 -->
      <div class="feature-section fr-mt-1w">
        <h2 class="fr-h4">
          Que souhaitez-vous faire du dossier de
          {{ formatBeneficiaryName(beneficiaryIdentification as Beneficiary) }}
          ?
        </h2>
        <p>
          Son dossier n’a pas été modifié depuis plus de 2 ans. Rappel RGPD
          blablabla. Les autres personnes du dossier foyer ne seront pas
          impactées par ces choix.
        </p>
        <VeeRadioButtons
          name="archive"
          label="archiver"
          :no-label="true"
          :options="radioButtonOptions"
          :pictos="archivePictos"
          :inline="false"
          :rich="true"
        />
        <p>
          Je souhaite
          <NuxtLink>conserver le dossier 1 an supplémentaire.</NuxtLink>
        </p>
      </div>

      <!-- TODO : composant 2 -->
      <AtomAlertMSS
        class="fr-mt-4w"
        :alert-type="AlertType.Warning"
        message="L’action ne pourra pas être annulée et aucune archive ne sera réalisée."
        detailed-message="L’ensemble des données relatives au dossier seront définitivement supprimées de Mon Suivi Social. Le dossier et ses accompagnements ne seront plus comptabilisés dans les statistiques."
      >
        <template #detailedMessage>
          <p>
            L’ensemble des données relatives au dossier seront définitivement
            supprimées de Mon Suivi Social. Le dossier et ses accompagnements ne
            seront plus comptabilisés dans les statistiques.
          </p>
        </template>
      </AtomAlertMSS>
      <button
        class="fr-btn btn-delete-action fr-btn--icon-left fr-icon-delete-line fr-mb-0 edit-btn fr-mt-4w"
      >
        Supprimer dénitivement
      </button>
    </template>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { routes } from '~/utils/routes'
  import { AlertType } from '~/utils/constants/alert'
  import { Beneficiary } from '@prisma/client'

  const title = routes.beneficiary.AppBeneficiaryArchive.title
  useHead({ title })
  definePageMeta({
    name: routes.beneficiary.AppBeneficiaryArchive.name
  })

  const route = useRoute()
  const { application } = usePermissions()
  const beneficiaryId = route.params.id as string

  const {
    beneficiary,
    permissions,
    draft,
    beneficiaryIdentification,
    familyIdentification,
    pending,
    error
  } = await useBeneficiaryDetails(beneficiaryId)

  console.log(beneficiary.value)
  console.log(application.value)

  const familyFileId: ComputedRef<string | null> = computed(
    () => beneficiary?.value?.familyFileId || null
  )

  // keys have to be the value of radioButtonOptions
  const archivePictos = {
    delete: '/pictograms/supprimer.svg',
    archive: '/pictograms/archive.svg'
  }

  const radioButtonOptions = [
    {
      value: 'delete',
      label: 'Supprimer définitivement le dossier'
    },
    { value: 'archive', label: 'Réaliser une archive et supprimer le dossier' }
  ]
</script>

<style lang="scss" scoped>
  .max-width {
    max-width: 792px;
  }
</style>
