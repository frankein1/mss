<template>
  <HelpRequestForm
    :is-submitting="isSubmitting"
    :partner-organizations="partnerOrganizations"
    :beneficiary-id="socialSupport.beneficiary.id"
    :family-file-id="socialSupport.familyFile.id"
    :can-edit-private-synthesis="permissions?.set.privateSynthesis"
    :caught-errors="caughtErrors"
    :subject="FileInstructionType.Housing"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  import { AskedHousing, FileInstructionType } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    EditHousingHelpRequestInput,
    editHousingHelpRequestSchema
  } from '~/server/schema'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { GetHousingHelpRequestOutput } from '~/server/trpc/routers'
  import { PartnerOrganizationIdName } from '~/types/partner'

  const { application } = usePermissions()

  const props = defineProps<{
    isSubmitting: boolean
    partnerOrganizations: PartnerOrganizationIdName[]
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

  const { handleSubmit, meta } = useForm<EditHousingHelpRequestInput>({
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
      lowIncomeHousingType: housingHelpRequest.value.lowIncomeHousingType || [],
      instructorOrganizationId: fileInstruction.value.instructorOrganizationId,
      instructorOrganizationContactId:
        fileInstruction.value.instructorOrganizationContactId,
      examinationDate: fileInstruction.value.examinationDate,
      decisionDate: fileInstruction.value.decisionDate,
      refusalReason: fileInstruction.value.refusalReason,
      dispatchDate: fileInstruction.value.dispatchDate,
      firstOpeningDate: housingHelpRequest.value.firstOpeningDate,
      reason: housingHelpRequest.value.reason,
      uniqueId: housingHelpRequest.value.uniqueId,
      taxHouseholdAdditionalInformation:
        housingHelpRequest.value.taxHouseholdAdditionalInformation
    }
  })

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const { caughtErrors, onSubmit } =
    useCatchFormErrors<EditHousingHelpRequestInput>(handleSubmit, values => {
      isNavigatingWithFormActions.value = true
      emit('saveHousingHelpRequest', values)
    })
</script>
