<template>
  <template v-if="similarBeneficiaries.length">
    <div class="fr-col-12">
      <AtomAlert
        :alert-type="AlertType.Warning"
        message="Un dossier semble déjà exister pour ce bénéficiaire"
      >
        <template #detailedMessage>
          <ul class="fr-raw-list">
            <li
              v-for="similar in similarBeneficiaries"
              :key="similar.id"
            >
              <NuxtLink :to="RoutePath.AppBeneficiary(similar.id)">
                {{ formatBeneficiaryDisplayName(similar)
                }}<template v-if="similar.birthDate">
                  - {{ formatDate(similar.birthDate) }}</template
                ></NuxtLink
              >
            </li>
          </ul>
          <p>
            Avant de créer un nouveau bénéficiaire, pensez à utiliser la
            recherche pour vérifier qu'il n'est pas déjà créé.
          </p>
          <!-- TODO: Not referent case -->
          <!-- Attention : Référent actif ! -->
          <p>
            Vous n'avez pas accès à ce dossier car vous n'êtes pas référent.
            Demandez à [nom agent référent du dossier] de partager ce dossier
            avec vous.
          </p>
        </template>
      </AtomAlert>
    </div>
    <OpenModalHack />
  </template>
</template>

<script setup lang="ts">
  import { SimilarBeneficiaries } from '~/server/trpc/routers'
  import { AlertType } from '~/utils/constants/alert'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { formatDate } from '~/utils/formatDate'
  import { RoutePath } from '~/utils/routing'
  import {
    getSimilarBeneficiariesSchema,
    GetSimilarBeneficiariesInput
  } from '~/server/schema'

  const props = defineProps<{
    similarBeneficiaries: SimilarBeneficiaries
    usualName: string | null | undefined
    firstName: string | null | undefined
    birthDate: Date | null | undefined
  }>()

  const emit = defineEmits<{
    'update:similarBeneficiaries': [SimilarBeneficiaries]
  }>()

  function isSimilarInputValid(input: {
    usualName: string | null | undefined
    firstName?: string | null | undefined
    birthDate?: Date | null | undefined
  }): input is GetSimilarBeneficiariesInput {
    return getSimilarBeneficiariesSchema.safeParse({
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
        emit('update:similarBeneficiaries', [])
        return
      }

      const similarBeneficiaries =
        await useTrpcClient().beneficiary.getSimilar.query(input)

      emit('update:similarBeneficiaries', similarBeneficiaries)
    }
  )
</script>
