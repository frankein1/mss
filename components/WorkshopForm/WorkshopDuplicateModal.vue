<template>
  <VeeRadioButtons
    name="duplicateParticipants"
    label="Souhaitez-vous conserver la liste des personnes participants sur l'atelier dupliqué ?"
    required
    :options="[
      { value: 'keepParticipants', label: 'Conserver la liste' },
      { value: 'removeParticipants', label: 'Ne pas conserver la liste' }
    ]"
  />
  <ul class="fr-btns-group fr-btns-group fr-btns-group--inline">
    <li>
      <button
        class="fr-btn fr-btn--secondary"
        type="button"
        @click="cancel()"
      >
        Annuler
      </button>
    </li>

    <li>
      <button
        class="fr-btn"
        type="button"
        @click="onSubmit()"
      >
        Confirmer la duplication de l'atelier
      </button>
    </li>
  </ul>
</template>
<script setup lang="ts">
  const props = defineProps<{
    cancel: () => void
    submit: (withParticipants: boolean) => void
  }>()

  const { values } = useForm({
    initialValues: {
      duplicateParticipants: 'removeParticipants'
    }
  })

  const onSubmit = () => {
    props.submit(values.duplicateParticipants === 'keepParticipants')
  }
</script>
