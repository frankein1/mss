import BeneficiaryDocumentAddForm from './BeneficiaryDocumentAddForm.vue'
import BeneficiaryDocumentEditForm from './BeneficiaryDocumentEditForm.vue'
import BeneficiaryHistoryCommentDeleteConfirm from './BeneficiaryHistoryCommentDeleteConfirm.vue'
import BeneficiaryHistoryDeleteForm from './BeneficiaryHistoryDeleteForm.vue'
import ExportDataConfirm from './ExportDataConfirm.vue'
import BeneficiaryDeleteForm from '~/components/BeneficiaryDeleteForm/BeneficiaryDeleteForm.vue'
import BeneficiaryLeaveForm from '~/components/BeneficiaryLeaveForm/BeneficiaryLeaveForm.vue'

import type { ComponentEmit, ComponentProps } from '~/types/vue'

export type ModalComponent =
  | InstanceType<typeof BeneficiaryDocumentAddForm>
  | InstanceType<typeof BeneficiaryDeleteForm>
  | InstanceType<typeof BeneficiaryDocumentEditForm>
  | InstanceType<typeof BeneficiaryHistoryCommentDeleteConfirm>
  | InstanceType<typeof BeneficiaryHistoryDeleteForm>
  | InstanceType<typeof ExportDataConfirm>
  | InstanceType<typeof BeneficiaryLeaveForm>

export type OpenModalEvent<M extends ModalComponent> = {
  title: string
  hideCloseButton?: boolean
  contentComponent: M
  contentComponentProps?: ComponentProps<M>
  contentComponentEvents: ComponentEmit<M>
  triggerOpen?: boolean
}
