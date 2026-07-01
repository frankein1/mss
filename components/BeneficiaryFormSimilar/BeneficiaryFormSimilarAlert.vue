<template>
  <template
    v-if="
      similarBeneficiary &&
      similarBeneficiary.familyFile &&
      similarBeneficiary.id != initialBeneficiary?.id
    "
  >
    <div class="fr-col-12">
      <AtomAlert
        :alert-type="AlertType.Warning"
        message="Un dossier semble déjà exister pour ce bénéficiaire"
      >
        <template #detailedMessage>
          <template v-if="!similarBeneficiary.referent">
            <NuxtLink
              :to="
                routes.file.AppFile.path(similarBeneficiary.familyFile.id, {
                  beneficiaryId: similarBeneficiary.id
                })
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
  </template>
</template>

<script setup lang="ts">
  import type { SimilarBeneficiary } from '~/server/trpc/routers'
  import { AlertType } from '~/utils/constants/alert'
  import { formatBeneficiaryNameAndBirthDate } from '~/utils/beneficiary'
  import { routes } from '~/utils/routes'
  import type { GetSimilarBeneficiaryInput } from '~/server/schema'
  import { getSimilarBeneficiarySchema } from '~/server/schema'
  import { formatUserDisplayName } from '~/utils/user'
  import type { BeneficiaryIdentification } from '~/types/beneficiary'

  const props = defineProps<{
    similarBeneficiary: SimilarBeneficiary
    birthName?: string | null | undefined
    usualName: string | null | undefined
    firstName: string | null | undefined
    birthDate: Date | null | undefined
    initialBeneficiary?: BeneficiaryIdentification | null
  }>()

  const emit = defineEmits<{
    'update:similarBeneficiary': [SimilarBeneficiary]
  }>()

  function isSimilarInputValid(input: {
    usualName?: string | null | undefined
    birthName?: string | null | undefined
    firstName?: string | null | undefined
    birthDate?: Date | null | undefined
  }): input is GetSimilarBeneficiaryInput {
    return getSimilarBeneficiarySchema.safeParse({
      usualName: input.usualName,
      birthName: input.birthName,
      firstName: input.firstName,
      birthDate: input.birthDate
    }).success
  }

  watch(
    [
      () => props.usualName,
      () => props.birthName,
      () => props.firstName,
      () => props.birthDate
    ],
    async ([usualName, birthName, firstName, birthDate]) => {
      const input = { usualName, birthName, firstName, birthDate }

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
