<template>
  <section
    ref="sectionRef"
    class="fr-p-3v"
  >
    <h2 class="title-blue fr-mb-6v">
      {{ routes.beneficiary.AppBeneficiaryEditEntourage.title }}
    </h2>

    <BeneficiaryFormEntourage
      v-for="(field, idx) in fields"
      :key="field.key"
      :entourage="field"
      :index="idx"
      @remove-entourage="remove(idx)"
    />

    <BeneficiaryFormSection>
      <div class="fr-col-12">
        <button
          class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-add-circle-line"
          type="button"
          @click="addEntourage()"
        >
          Ajouter un proche
        </button>
      </div>
    </BeneficiaryFormSection>
  </section>
</template>

<script setup lang="ts">
  import type { CreateOrUpdateEntourageInput } from '~~/server/schema'
  import { routes } from '~/utils/routes'

  const sectionRef = useTemplateRef('sectionRef')
  const { focusElementAdded } = useDynamicFieldFocus(sectionRef)

  const { remove, fields, push } =
    useFieldArray<CreateOrUpdateEntourageInput>('entourages')

  function addEntourage() {
    push({ id: crypto.randomUUID(), caregiver: false, hosted: false })
    focusElementAdded()
  }
</script>
