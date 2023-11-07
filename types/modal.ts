import BeneficiaryDocumentAddForm from './BeneficiaryDocumentAddForm.vue'
import type { ComponentEmit, ComponentProps } from '~/types/vue'

export type ModalComponent = InstanceType<typeof BeneficiaryDocumentAddForm>

export type OpenModalEvent<M extends ModalComponent> = {
  title: string
  contentComponent: M
  contentComponentProps?: ComponentProps<M>
  contentComponentEvents?: ComponentEmit<M>
  triggerOpen?: boolean
}
