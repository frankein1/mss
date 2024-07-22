<template>
  <template v-if="similarBeneficiary">
    <div class="fr-col-12">
      <AtomAlert
        :alert-type="AlertType.Warning"
        message="Un dossier semble déjà exister pour ce bénéficiaire"
      >
        <template #detailedMessage>
          <template v-if="!similarBeneficiary.referent">
            <NuxtLink
              :to="
                routes.beneficiary.AppBeneficiary.path(similarBeneficiary.id)
              "
            >
              {{ similarBeneficiaryLabel }}
            </NuxtLink>
            <p>
              Avant de créer un nouveau bénéficiaire, pensez à utiliser la
              recherche pour vérifier qu'il n'est pas déjà créé.
            </p>
          </template>
          <template v-else>
            <p>{{ similarBeneficiaryLabel }}</p>
            <p>
              Vous n'avez pas accès à ce dossier car vous n'êtes pas référent.
              Demandez à
              {{ formatUserDisplayName(similarBeneficiary.referent) }} de
              partager ce dossier avec vous.
            </p>
          </template>
        </template>
      </AtomAlert>
    </div>
    <OpenModalHack />
  </template>
</template>

<script setup lang="ts">
  import { SimilarBeneficiary } from '~/server/trpc/routers'
  import { AlertType } from '~/utils/constants/alert'
  import { formatBeneficiaryNameAndBirthDate } from '~/utils/beneficiary'
  import { routes } from '~/utils/routes'
  import {
    getSimilarBeneficiarySchema,
    GetSimilarBeneficiaryInput
  } from '~/server/schema'
  import { formatUserDisplayName } from '~/utils/user'

  const props = defineProps<{
    similarBeneficiary: SimilarBeneficiary
    usualName: string | null | undefined
    firstName: string | null | undefined
    birthDate: Date | null | undefined
  }>()

  const emit = defineEmits<{
    'update:similarBeneficiary': [SimilarBeneficiary]
  }>()

  function isSimilarInputValid(input: {
    usualName: string | null | undefined
    firstName?: string | null | undefined
    birthDate?: Date | null | undefined
  }): input is GetSimilarBeneficiaryInput {
    return getSimilarBeneficiarySchema.safeParse({
      usualName: input.usualName,
      firstName: input.firstName,
      birthDate: input.birthDate
    }).success
  }

  watch(
    [() => props.usualName, () => props.firstName, () => props.birthDate],
    async ([usualName, firstName, birthDate]) => {
      const input = { usualName, firstName, birthDate }
      if (!isSimilarInputValid(input)) {
        emit('update:similarBeneficiary', undefined)
        return
      }

      const similarBeneficiary =
        await useTrpcClient().beneficiary.getSimilar.query(input)

      emit('update:similarBeneficiary', similarBeneficiary)
    }
  )

  const similarBeneficiaryLabel = computed(() =>
    props.similarBeneficiary
      ? formatBeneficiaryNameAndBirthDate(props.similarBeneficiary)
      : ''
  )
</script>
