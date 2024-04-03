import BeneficiaryDeleteForm from '~/components/BeneficiaryDeleteForm/BeneficiaryDeleteForm.vue'
import LeaveFormModal from '~/components/LeaveFormModal/LeaveFormModal.vue'
import HelpRequestModal from '~/components/HelpRequestModal/HelpRequestModal.vue'
import DisconnectAlert from '~/components/Disconnect/DisconnectAlert.vue'
import BeneficiaryFormSimilarModal from '~/components/BeneficiaryFormSimilar/BeneficiaryFormSimilarModal.vue'
import PartnerOrganizationEdition from '~/components/PartnerOrganization/PartnerOrganizationEdition.vue'
import PartnerOrganizationCreation from '~/components/PartnerOrganization/PartnerOrganizationCreation.vue'
import PartnerOrganizationRemoveAlert from '~/components/PartnerOrganization/PartnerOrganizationRemoveAlert.vue'
import BeneficiaryDocumentAddForm from '~/components/BeneficiaryDocument/BeneficiaryDocumentAddForm.vue'
import BeneficiaryDocumentEditForm from '~/components/BeneficiaryDocument/BeneficiaryDocumentEditForm.vue'
import BeneficiaryHistoryCommentDeleteConfirm from '~/components/BeneficiaryHistory/BeneficiaryHistoryCommentDeleteConfirm.vue'
import BeneficiaryHistoryDeleteForm from '~/components/BeneficiaryHistory/BeneficiaryHistoryDeleteForm.vue'
import ExportDataConfirm from '~/components/ExportData/ExportDataConfirm.vue'

import type { ComponentEmit, ComponentProps } from '~/types/vue'

export type ModalComponent =
  | InstanceType<typeof BeneficiaryDocumentAddForm>
  | InstanceType<typeof BeneficiaryDeleteForm>
  | InstanceType<typeof BeneficiaryDocumentEditForm>
  | InstanceType<typeof BeneficiaryHistoryCommentDeleteConfirm>
  | InstanceType<typeof BeneficiaryHistoryDeleteForm>
  | InstanceType<typeof ExportDataConfirm>
  | InstanceType<typeof LeaveFormModal>
  | InstanceType<typeof HelpRequestModal>
  | InstanceType<typeof DisconnectAlert>
  | InstanceType<typeof BeneficiaryFormSimilarModal>
  | InstanceType<typeof PartnerOrganizationEdition>
  | InstanceType<typeof PartnerOrganizationCreation>
  | InstanceType<typeof PartnerOrganizationRemoveAlert>

export type OpenModalEvent<M extends ModalComponent> = {
  title: string
  contentComponent: M
  contentComponentProps?: ComponentProps<M>
  contentComponentEvents: ComponentEmit<M>
  triggerOpen?: boolean
}
