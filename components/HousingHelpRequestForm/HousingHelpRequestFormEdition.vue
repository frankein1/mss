<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :instructor-organizations="instructorOrganizations"
    :beneficiary-id="socialSupport.beneficiary.id"
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

  const housingHelpRequest = computed(() => props.data.housingHelpRequest)
  const fileInstruction = computed(
    () => housingHelpRequest.value.fileInstruction
  )
  const socialSupport = computed(() => fileInstruction.value.socialSupport)

  const permissions = computed(() => props.data.permissions)

  const initialDocumentIds = computed(
    () => socialSupport.value.documents?.map(d => d.key) || []
  )

  const { handleSubmit } = useForm<EditHousingHelpRequestInput>({
    validationSchema: toTypedSchema(editHousingHelpRequestSchema),
    initialValues: {
      id: housingHelpRequest.value.id,
      socialSupportId: socialSupport.value.id,
      beneficiaryId: socialSupport.value.beneficiary.id,
      date: socialSupport.value.date,
      isMinistry: application.value.module.ministere,
      synthesis: socialSupport.value.synthesis,
      privateSynthesis: socialSupport.value.privateSynthesis,
      ministre: socialSupport.value.ministre,
      numeroPegase: socialSupport.value.numeroPegase,
      status: socialSupport.value.status,
      dueDate: socialSupport.value.dueDate,
      documents: initialDocumentIds.value,
      externalStructure: fileInstruction.value.externalStructure
        ? 'true'
        : 'false',
      isFirst: housingHelpRequest.value.isFirst ? 'true' : 'false',
      fullFile: fileInstruction.value.fullFile || false,
      isPmr: housingHelpRequest.value.isPmr || false,
      maxRent: prismaDecimalToNumber(housingHelpRequest.value.maxRent),
      maxCharges: prismaDecimalToNumber(housingHelpRequest.value.maxCharges),
      [AskedHousing.HebergementTemporaire]:
        housingHelpRequest.value.askedHousing?.includes(
          AskedHousing.HebergementTemporaire
        ),
      [AskedHousing.ParcPrive]: housingHelpRequest.value.askedHousing?.includes(
        AskedHousing.ParcPrive
      ),
      [AskedHousing.ParcSocial]:
        housingHelpRequest.value.askedHousing?.includes(
          AskedHousing.ParcSocial
        ),
      housingType: housingHelpRequest.value.housingType || [],
      roomCount: housingHelpRequest.value.roomCount || [],
      instructorOrganizationId: fileInstruction.value.instructorOrganizationId,
      examinationDate: fileInstruction.value.examinationDate,
      decisionDate: fileInstruction.value.decisionDate,
      refusalReason: fileInstruction.value.refusalReason,
      dispatchDate: fileInstruction.value.dispatchDate,
      firstOpeningDate: housingHelpRequest.value.firstOpeningDate,
      reason: fileInstruction.value.reason,
      uniqueId: housingHelpRequest.value.uniqueId,
      taxHouseholdAdditionalInformation:
        housingHelpRequest.value.taxHouseholdAdditionalInformation
    }
  })

  const { caughtErrors, onSubmit } =
    useCatchFormErrors<EditHousingHelpRequestInput>(handleSubmit, values => {
      emit('saveHousingHelpRequest', values)
    })
</script>
