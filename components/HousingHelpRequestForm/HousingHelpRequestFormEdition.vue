<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :instructor-organizations="instructorOrganizations"
    :beneficiary-id="helpRequestData.beneficiaryId"
    :can-edit-private-synthesis="permissions?.set.privateSynthesis"
    :caught-errors="caughtErrors"
    subject="Housing"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import { AskedHousing, InstructorOrganization } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    EditHousingHelpRequestInput,
    editHousingHelpRequestSchema
  } from '~/server/schema'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { GetHousingHelpRequestOutput } from '~/server/trpc/routers'

  const { application } = usePermissions()

  const props = defineProps<{
    isSubmitting: boolean
    instructorOrganizations: InstructorOrganization[]
    data: GetHousingHelpRequestOutput
  }>()

  const emit = defineEmits<{
    saveHelpRequest: [helpRequest: EditHousingHelpRequestInput]
  }>()

  const helpRequestData = computed(() => props.data.helpRequest)
  const permissions = computed(() => props.data.permissions)

  const initialDocumentIds = computed(
    () => helpRequestData.value.documents?.map(d => d.key) || []
  )

  const { handleSubmit } = useForm<EditHousingHelpRequestInput>({
    validationSchema: toTypedSchema(editHousingHelpRequestSchema),
    initialValues: {
      ...helpRequestData.value,
      isMinistry: application.value.module.ministere,
      date: helpRequestData.value.date,
      documents: initialDocumentIds.value,
      externalStructure: helpRequestData.value.externalStructure
        ? 'true'
        : 'false',
      isFirst: helpRequestData.value.isFirst ? 'true' : 'false',
      fullFile: helpRequestData.value.fullFile || false,
      isPmr: helpRequestData.value.isPmr || false,
      maxRent: prismaDecimalToNumber(helpRequestData.value.maxRent),
      maxCharges: prismaDecimalToNumber(helpRequestData.value.maxCharges),
      [AskedHousing.HebergementTemporaire]:
        helpRequestData.value.askedHousing?.includes(
          AskedHousing.HebergementTemporaire
        ),
      [AskedHousing.ParcPrive]: helpRequestData.value.askedHousing?.includes(
        AskedHousing.ParcPrive
      ),
      [AskedHousing.ParcSocial]: helpRequestData.value.askedHousing?.includes(
        AskedHousing.ParcSocial
      ),
      housingType: helpRequestData.value.housingType || [],
      roomCount: helpRequestData.value.roomCount || []
    }
  })

  const { caughtErrors, onSubmit } =
    useCatchFormErrors<EditHousingHelpRequestInput>(handleSubmit, values => {
      emit('saveHelpRequest', values)
    })
</script>
