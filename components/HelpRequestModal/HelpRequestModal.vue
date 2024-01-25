<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <VeeRadioButtons
      name="subject"
      label="L'instruction concerne"
      :options="helpRequestSubjectOptions"
      :pictos="helpRequestSubjectPictos"
      :inline="false"
      required
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
  import {
    helpRequestSubjectOptions,
    helpRequestSubjectPictos
  } from '~/client/options/helpRequest'
  import { RoutePath } from '~/utils/routing'
  import { HelpRequestSubject } from '~/types/socialSupport'

  const modal = useModal()

  const props = defineProps<{
    beneficiaryId: string
  }>()

  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit } = useForm<{ subject: HelpRequestSubject }>({
    validationSchema: toTypedSchema(
      z.object({
        subject: z.nativeEnum(HelpRequestSubject, {
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
        RoutePath.AppBeneficiaryHelpRequestAdd(props.beneficiaryId, subject)
      )
    }
  )

  useDisplayFormErrors(form, caughtErrors, {})
</script>
