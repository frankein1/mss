<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :instructor-organizations="instructorOrganizations"
    :beneficiary-id="housingHelpRequestData.beneficiaryId"
    :can-edit-private-synthesis="permissions?.set.privateSynthesis"
    :caught-errors="caughtErrors"
    :subject="HelpRequestSubject.Housing"
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
  import { HelpRequestSubject } from '~/types/socialSupport'

  const { application } = usePermissions()

  const props = defineProps<{
    isSubmitting: boolean
    instructorOrganizations: InstructorOrganization[]
    data: GetHousingHelpRequestOutput
  }>()

  const emit = defineEmits<{
    saveHousingHelpRequest: [housingHelpRequest: EditHousingHelpRequestInput]
  }>()

  const housingHelpRequestData = computed(() => props.data.housingHelpRequest)
  const permissions = computed(() => props.data.permissions)

  const initialDocumentIds = computed(
    () => housingHelpRequestData.value.documents?.map(d => d.key) || []
  )

  const { handleSubmit } = useForm<EditHousingHelpRequestInput>({
    validationSchema: toTypedSchema(editHousingHelpRequestSchema),
    initialValues: {
      ...housingHelpRequestData.value,
      isMinistry: application.value.module.ministere,
      date: housingHelpRequestData.value.date,
      documents: initialDocumentIds.value,
      externalStructure: housingHelpRequestData.value.externalStructure
        ? 'true'
        : 'false',
      isFirst: housingHelpRequestData.value.isFirst ? 'true' : 'false',
      fullFile: housingHelpRequestData.value.fullFile || false,
      isPmr: housingHelpRequestData.value.isPmr || false,
      maxRent: prismaDecimalToNumber(housingHelpRequestData.value.maxRent),
      maxCharges: prismaDecimalToNumber(
        housingHelpRequestData.value.maxCharges
      ),
      [AskedHousing.HebergementTemporaire]:
        housingHelpRequestData.value.askedHousing?.includes(
          AskedHousing.HebergementTemporaire
        ),
      [AskedHousing.ParcPrive]:
        housingHelpRequestData.value.askedHousing?.includes(
          AskedHousing.ParcPrive
        ),
      [AskedHousing.ParcSocial]:
        housingHelpRequestData.value.askedHousing?.includes(
          AskedHousing.ParcSocial
        ),
      housingType: housingHelpRequestData.value.housingType || [],
      roomCount: housingHelpRequestData.value.roomCount || []
    }
  })

  const { caughtErrors, onSubmit } =
    useCatchFormErrors<EditHousingHelpRequestInput>(handleSubmit, values => {
      emit('saveHousingHelpRequest', values)
    })
</script>
