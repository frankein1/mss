<template>
  <AtomAlert
    v-if="fileError"
    :alert-type="AlertType.Error"
    message="Le dossier n'a pas pu être chargé."
  />
  <PageContainer v-else-if="familyFileIdentification !== null">
    <AtomBreadcrumb
      :links="breadcrumbs.file.AppFile(familyFileId, familyFileIdentification)"
    />

    <!-- Badge foyer -->
    <div
      v-if="familyFileIdentification.length > 1"
      class="fr-badge"
    >
      Dossier foyer
    </div>

    <!-- Noms des membres du dossier -->
    <div>
      <div>{{ formatFamilyFileName(familyFileIdentification) }}</div>

      <button
        class="fr-btn"
        @click="addMember"
      >
        Ajouter un membre au dossier
      </button>
    </div>

    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="La fiche bénéficiaire n'a pas pu être chargée."
    />
    <div v-else>
      <!-- Infos générales bénéficiaire [id] -->
      <div>
        Page bénéficiaire au sein d'un dossier pour
        {{ beneficiary?.general.firstName }}
      </div>

      <button
        class="fr-btn"
        @click="beneficiaryId = familyFileIdentification[1].id"
      >
        Aller à l'autre bénéficiaire du dossier
      </button>
    </div>
  </PageContainer>
  <AtomAlert
    v-else
    :alert-type="AlertType.Error"
    message="Erreur inconnue."
  />
</template>

<script setup lang="ts">
  import { useFamilyFileMinimalInfo } from '~/composables/useFamilyFileMinimalInfo'
  import { AlertType } from '~/utils/constants/alert'
  import { formatFamilyFileName } from '~/utils/familyFile'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const route = useRoute()

  const familyFileId = route.params.id as string
  const queryBeneficiaryId = route.query.bid as string

  const { familyFileIdentification, error: fileError } =
    await useFamilyFileMinimalInfo(familyFileId)

  const title = routes.file.AppFile.title(
    familyFileIdentification.value || null
  )

  useHead({ title })

  const defaultBeneficiaryId =
    familyFileIdentification.value && familyFileIdentification.value.length > 0
      ? familyFileIdentification.value[0].id
      : ''
  const beneficiaryId = ref(queryBeneficiaryId || defaultBeneficiaryId)

  const queryInput = computed(() => ({ id: beneficiaryId.value }))
  const { data, pending, error } =
    await useTrpcClient().beneficiary.getBeneficiaryDetails.useQuery(queryInput)

  const beneficiary = computed(() => data.value?.beneficiary || null)

  const isSubmitting = ref(false)

  function addMember() {
    useTrpcMutation({
      mutation: () =>
        useTrpcClient().beneficiary.addFamilyFileMember.mutate({
          familyFileId,
          usualName: 'TOTO',
          firstName: 'New Member',
          referents: [
            '94dea7ab-92e9-479a-9795-e4fdd4ef42af',
            '7e5c1734-35cb-4047-9035-a944961a67a4'
          ],
          relationship: 'Conjoint'
        }),
      isSubmitting,
      onSuccess: ({ id }) => {
        useSnackbar().success('Création réussie ' + id)
      },
      onFailure: () => {
        useSnackbar().error('La création a échoué.')
      }
    })
  }
</script>
