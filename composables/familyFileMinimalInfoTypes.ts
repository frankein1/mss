import type { ComputedRef } from 'vue'
import type { getMinimalInfo } from '~/server/services/familyFile/getMinimalInfo.service'

type MinimalInfo = Awaited<ReturnType<typeof getMinimalInfo>>

export type FamilyFileIdentification = MinimalInfo['beneficiaries']
export type FamilyFileIdentificationRef = ComputedRef<FamilyFileIdentification>

export type FamilyFilePermissions = MinimalInfo['permissions']
export type FamilyFilePermissionsRef = ComputedRef<FamilyFilePermissions>
