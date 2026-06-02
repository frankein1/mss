<template>
  <section
    class="fr-grid-row fr-grid-row--gutters feature-section fr-mb-2w fr-mt-2w"
  >
    <div class="fr-col-12">
      <VeeRadioButtons
        name="duplicateParticipantsOption"
        label="Souhaitez-vous conserver la liste des personnes participantes sur l'atelier dupliqué ?"
        :options="options"
        :hint="
          isReferent()
            ? 'Le rôle Référent ne possede pas les droits pour dupliquer les personnes participantes.'
            : undefined
        "
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  const { isReferent } = useAuthState()
  const referent = isReferent()

  const { value: duplicateParticipantsOption } = useField<string>(
    'duplicateParticipantsOption'
  )
  if (referent) {
    duplicateParticipantsOption.value = 'removeParticipants'
  }

  const options = [
    {
      value: 'removeParticipants',
      label: 'Ne pas conserver la liste',
      disabled: referent
    },
    {
      value: 'keepParticipants',
      label: 'Conserver la liste',
      disabled: referent
    }
  ]
</script>
