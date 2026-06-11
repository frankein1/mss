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
          !canDuplicateParticipants
            ? 'Vous ne disposez pas des droits pour dupliquer les personnes participantes.'
            : undefined
        "
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  const { application } = usePermissions()
  const canDuplicateParticipants = application.value.workshop.duplicateAttendees

  const { value: duplicateParticipantsOption } = useField<string>(
    'duplicateParticipantsOption'
  )
  if (!canDuplicateParticipants) {
    duplicateParticipantsOption.value = 'removeParticipants'
  }

  const options = [
    {
      value: 'removeParticipants',
      label: 'Ne pas conserver la liste',
      disabled: !canDuplicateParticipants
    },
    {
      value: 'keepParticipants',
      label: 'Conserver la liste',
      disabled: !canDuplicateParticipants
    }
  ]
</script>
