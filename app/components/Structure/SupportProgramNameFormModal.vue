<template>
  <form
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <VeeInput
          name="name"
          label="Nom du dispositif ou axe d'intervention (obligatoire)"
          hint="Choisissez un nom court et clair"
        />
      </div>

      <div class="fr-col-12">
        <VeeToggle
          :disabled="initialHasLifecycle && hasLinkedEntities"
          name="hasLifecycle"
          label="Ce dispositif ou axe d'intervention comporte des dates d'entrée et de sortie."
          hint="Les dates d'entrée et de sortie, le motif de sortie et l'atteinte des objectifs seront proposés sur la fiche du bénéficiaire."
        />
      </div>

      <div
        v-if="initialHasLifecycle && hasLinkedEntities"
        class="fr-col-12"
      >
        <AtomAlert
          :alert-type="AlertType.Info"
          :message="`Ce dispositif ou axe d'intervention est déjà lié à ${count} bénéficiaire(s) ou atelier(s), l'option &quot;dates&quot; ne peut donc pas être désactivée.`"
          :closeable="false"
        />
      </div>

      <div
        v-if="showUpgradeAlert"
        class="fr-col-12"
      >
        <AtomAlert
          :alert-type="AlertType.Info"
          :message="`Ce nom de dispositif ou axe d'intervention est utilisé par ${count} bénéficiaire(s) ou atelier(s) au sein de la structure. Pensez à mettre à jour les bénéficiaires concernés.`"
          :closeable="false"
        />
      </div>

      <div class="fr-col-12">
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
              :disabled="isSubmitting"
              :data-submitting="isSubmitting"
            >
              {{ submitLabel }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
  import type { UpsertSupportProgramNameInput } from '~~/server/schema'
  import { upsertSupportProgramNameSchema } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'

  const modal = useModal()
  const trpcClient = useTrpcClient()

  const props = defineProps<{
    id?: string
    name?: string
    hasLifecycle?: boolean
    isSubmitting: boolean
    validate: (name: string, id?: string) => boolean
    submit: (values: UpsertSupportProgramNameInput) => void
  }>()

  const submitLabel = computed(() => (props.id ? 'Modifier' : 'Ajouter'))

  const { data: count } = props.id
    ? await trpcClient.supportProgram.countNameUsage.useQuery({ id: props.id })
    : { data: ref(0) }

  const { handleSubmit, setErrors } = useForm<UpsertSupportProgramNameInput>({
    validationSchema: toTypedSchema(upsertSupportProgramNameSchema),
    initialValues: {
      id: props.id,
      name: props.name ?? '',
      hasLifecycle: props.hasLifecycle ?? false
    }
  })

  const initialHasLifecycle = props.hasLifecycle ?? false

  const currentHasLifecycle = useFieldValue<boolean>('hasLifecycle')

  const hasLinkedEntities = computed(() => (count.value ?? 0) > 0)

  const showUpgradeAlert = computed(
    () =>
      !initialHasLifecycle &&
      currentHasLifecycle.value &&
      hasLinkedEntities.value
  )

  const onSubmit = handleSubmit(values => {
    const isUnique = props.validate(values.name, props.id)
    if (!isUnique) {
      setErrors({
        name: "Ce nom de dispositif ou axe d'intervention existe déjà"
      })
      return
    }
    props.submit(values)
  })
</script>
