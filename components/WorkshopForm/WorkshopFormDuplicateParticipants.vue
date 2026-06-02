<template>
  <section
    class="fr-grid-row fr-grid-row--gutters feature-section fr-mb-2w fr-mt-2w"
  >
    <div class="fr-col-12">
      <VeeRadioButtons
        name="duplicateParticipantsOption"
        label="Souhaitez-vous conserver la liste des personnes participantes sur l'atelier dupliqué ?"
        :options="[
          { value: 'removeParticipants', label: 'Ne pas conserver la liste' },
          { value: 'keepParticipants', label: 'Conserver la liste' }
        ]"
      />
    </div>
  </section>
</template>
