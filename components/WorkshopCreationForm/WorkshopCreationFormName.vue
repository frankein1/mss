<template>
  <section
    class="fr-grid-row fr-grid-row--gutters feature-section fr-mb-2w fr-mt-2w"
  >
    <div class="fr-col-12">
      <VeeInput
        type="text"
        :label="workshopLabels.name"
        name="name"
        :disabled="pending"
        required
      />
      <DsfrAccordionsGroup class="fr-mt-2w">
        <DsfrAccordion
          id="workshop-form-accordion-1"
          title="L'atelier a plusieurs séances : comment faire ?"
          title-tag="p"
        >
          <p>
            Vous pourrez dupliquer cet atelier à la prochaine étape. Le nom de
            l'atelier sera alors conjoint à toutes les séances et vous permettra
            de générer facilement des statistiques. Si vous souhaitez
            différencier les séances en plus de la date, vous pouvez utiliser le
            champ “Nom ou numéro de la séance” dans la description de votre
            atelier ci-dessous.
          </p>
          <p>
            <span
              class="leaf-icon fr-mr-1v"
              aria-hidden="true"
            />
            Conseil : en nom d’atelier, restez générique (par exemple “atelier
            numérique”).
          </p>
        </DsfrAccordion>
      </DsfrAccordionsGroup>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { workshopLabels } from '~/client/labels'

  defineProps<{
    isSubmitting: boolean
    pending: boolean
  }>()
</script>
