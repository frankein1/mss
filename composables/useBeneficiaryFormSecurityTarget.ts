import { GetBeneficiaryDetailsOutput } from '~/server/trpc/routers'
import { useAuthStore } from '~/store/auth'
import {
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '~/server/security'

function beneficiaryDraftFormSecurityTarget(
  userId: string,
  structureId: string | null
): Ref<SecurityTargetWithReferents & SecurityTargetWithStructure> {
  return computed(() => ({ referents: [userId], structureId }))
}

function beneficiaryEditFormSecurityTarget(
  data: Ref<GetBeneficiaryDetailsOutput | null>
): Ref<SecurityTargetWithReferents & SecurityTargetWithStructure> {
  return computed(() => {
    if (!data.value) {
      return {
        referents: [],
        structureId: null
      }
    }
    const { beneficiary } = data.value

    return {
      referents: beneficiary.referents,
      structureId: beneficiary.structureId
    }
  })
}

export function useBeneficiaryFormSecurityTarget(
  data?: Ref<GetBeneficiaryDetailsOutput | null>
): Ref<SecurityTargetWithReferents & SecurityTargetWithStructure> {
  if (!data) {
    const authStore = useAuthStore()

    const user = computed(() => authStore.getAuthUser)

    return beneficiaryDraftFormSecurityTarget(
      user.value.id,
      user.value.structureId
    )
  }

  return beneficiaryEditFormSecurityTarget(data)
}
