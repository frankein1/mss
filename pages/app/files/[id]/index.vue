<template>
  <PageContainer v-if="familyFileIdentification">
    <!-- TODO: add loader + error components -->

    <AtomBreadcrumb
      :links="breadcrumbs.file.AppFile(familyFileId, familyFileIdentification)"
    />

    <AtomLoader
      v-if="pending"
      class="loading-state"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="La fiche foyer n'a pas pu être chargée."
    />

    <template v-else>
      <!-- TODO: add permissions on header + actions -->
      <FamilyFileDetailsHeader
        :beneficiaries="familyFileIdentification"
        :title="title"
        @open-modal="onOpenModal"
      />

      <hr />

      <!-- TODO: demander des permissions pour avoir acces au bouton instruction de dossier -->
      <BeneficiaryDetailsHistoryActions
        :beneficiary-id="familyFileIdentification[0].id"
        :permissions="undefined"
        class="fr-pb-3w"
      />

      <AtomTabs tab-list-name="Détails de la fiche bénéficiaire">
        <AtomTab
          :tab-id="FamilyFileTab.Details"
          title="Informations"
          icon="fr-icon-information-fill"
          selected
        >
          <FamilyFileSegmentedControl
            v-if="selectedBeneficiary"
            :members="familyFileIdentification"
            :model-value="selectedBeneficiary.id"
            @on-change="onChange"
          />
          <AtomLoader
            v-if="selectedPending"
            class="fr-mx-auto"
          />
          <AtomAlert
            v-else-if="selectedError"
            :alert-type="AlertType.Error"
            message="La fiche bénéficiaire n'a pas pu être chargée."
          />
          <BeneficiaryInfo
            v-else-if="selectedBeneficiary"
            :beneficiary="selectedBeneficiary"
            :social-support-subjects="socialSupportSubjects"
            :permissions="selectedPermissions"
            @toggle-delete="toggleDelete"
            @deleted="onBeneficiaryDeleted"
          />
        </AtomTab>
        <AtomTab
          :tab-id="FamilyFileTab.Documents"
          title="Documents"
          icon="fr-icon-information-fill"
          selected
        >
          <p>Documents</p>
        </AtomTab>
        <AtomTab
          :tab-id="FamilyFileTab.History"
          title="Historique"
          icon="fr-icon-information-fill"
          selected
        >
          <p>Historique</p>
        </AtomTab>
        <AtomTab
          :tab-id="FamilyFileTab.Budget"
          title="Budget"
          icon="fr-icon-information-fill"
          selected
        >
          <p>Budget</p>
        </AtomTab>
      </AtomTabs>
    </template>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { FamilyFilePermissions } from '~/server/security'
  import { GetBeneficiaryOutput } from '~/types/beneficiary'
  import { AlertType } from '~/utils/constants/alert'

  const route = useRoute()

  // states
  const selectedBeneficiary = useState(
    'selectedBeneficiary',
    (): GetBeneficiaryOutput | null => null
  )
  const selectedPermissions = useState(
    'selectedPermissions',
    (): FamilyFilePermissions | undefined => undefined
  )
  const selectedPending = useState('selectedPending', (): boolean => true)
  const selectedError = useState('selectedError', (): any | null => null)
  const socialSupportSubjects = computed(() => []) // TODO: it should be selectedBeneficiary.value?.history.subjects

  // Get family informations
  const familyFileId = route.params.id as string
  const { familyFileIdentification, pending, error } =
    await useFamilyFileMinimalInfo(familyFileId)
  const title = routes.file.AppFile.title(familyFileIdentification.value)

  // Get beneficiaryDetails
  const getBeneficiaryDetails = async (id: string): Promise<void> => {
    const { beneficiary, permissions, pending, error } =
      await useBeneficiaryDetails(id)
    selectedBeneficiary.value = beneficiary.value
    selectedPermissions.value = permissions.value
    selectedPending.value = pending.value
    selectedError.value = error.value
  }

  if (familyFileIdentification && familyFileIdentification.value?.length) {
    getBeneficiaryDetails(familyFileIdentification.value[0].id)
  }

  // Open modal
  const onOpenModal = () => {
    console.log('modale ouverte')
  }

  // Segmented Family
  const onChange = (beneficiaryId: string): void => {
    navigateTo(
      `/app/files/1143e166-4730-4e94-af3d-b97ba89e407d?beneficiary=${beneficiaryId}#Details`
    ) // TODO: generate url with appropriate function
    getBeneficiaryDetails(beneficiaryId)
  }
  enum FamilyFileTab {
    Details = 'Details',
    Documents = 'Documents',
    History = 'History',
    Budget = 'Budget'
  }

  const toggleDelete = () => {
    console.log('toggle Delete')
  }
  const onBeneficiaryDeleted = () => {
    console.log('beneficiary Deleted')
  }
</script>

<style lang="scss" scoped></style>
