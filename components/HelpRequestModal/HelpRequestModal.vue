<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <VeeRadioButtons
      name="subject"
      label="L'instruction concerne"
      :options="fileInstructionTypeKeys.options"
      :pictos="fileInstructionTypePictos"
      :inline="false"
      required
      rich
    />

    <ul
      class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-mt-3w"
    >
      <li>
        <button
          class="fr-btn fr-btn--secondary"
          type="button"
          @click="modal.close"
        >
          Annuler
        </button>
      </li>
      <li>
        <button
          class="fr-btn"
          type="submit"
        >
          Continuer
        </button>
      </li>
    </ul>
  </form>
</template>

<script setup lang="ts">
  import { z } from 'zod'
  import { FileInstructionType } from '@prisma/client'
  import {
    fileInstructionTypeKeys,
    fileInstructionTypePictos
  } from '~/client/options'
  import { routes } from '~/utils/routes'

  const modal = useModal()

  const props = defineProps<{
    familyFileId: string
    beneficiaryId: string
  }>()

  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit } = useForm<{ subject: FileInstructionType }>({
    validationSchema: toTypedSchema(
      z.object({
        subject: z.nativeEnum(FileInstructionType, {
          required_error: "Veuillez sélectionner un type d'accompagnement."
        })
      })
    )
  })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    ({ subject }) => {
      modal.close()
      navigateTo(
        routes.helpRequest.AppBeneficiaryHelpRequestAdd.path(
          props.familyFileId,
          subject,
          { beneficiaryId: props.beneficiaryId }
        )
      )
    }
  )

  useDisplayFormErrors(form, caughtErrors, {})
</script>
