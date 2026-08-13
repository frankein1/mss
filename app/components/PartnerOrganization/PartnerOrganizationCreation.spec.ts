// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import PartnerOrganizationCreation from './PartnerOrganizationCreation.vue'
import {
  createFakeTrpcClient,
  fillInput,
  submitForm,
  waitForDebounce
} from '~~/test/components/helpers'

const fakeTrpcClient = createFakeTrpcClient()

mockNuxtImport('useTrpcClient', () => () => fakeTrpcClient)

const fakeStructure = {
  id: 'di-structure-1',
  name: 'Structure Data Inclusion',
  siret: '98765432109876',
  address: '12 rue de Paris',
  zipcode: '75001',
  city: 'Paris',
  email: 'contact@structure.fr',
  phone: '0102030405',
  website: 'https://structure.fr',
  workingHours: 'Lundi-Vendredi 9h-17h'
}

function mountCreationForm() {
  const finish = vi.fn()
  const restore = vi.fn()
  return {
    finish,
    restore,
    mount: mountSuspended(PartnerOrganizationCreation, {
      props: {
        isSubmitting: false,
        existingDataInclusionV1Ids: [],
        finish,
        cancel: vi.fn(),
        restore
      }
    })
  }
}

describe('PartnerOrganizationCreation', () => {
  beforeEach(() => {
    fakeTrpcClient.partner.findBySiret.query.mockResolvedValue(null)
    fakeTrpcClient.dataInclusion.searchStructures.query.mockResolvedValue({
      results: []
    })
  })

  it('creates a custom partner with name and siret', async () => {
    const { finish, mount } = mountCreationForm()
    const wrapper = await mount

    await fillInput(wrapper, 'name', 'Organisme Test')
    await fillInput(wrapper, 'siret', '12345678901234')
    await submitForm(wrapper)

    expect(finish).toHaveBeenCalledOnce()
    expect(finish).toHaveBeenCalledWith(
      expect.objectContaining({
        dataSource: 'Custom',
        name: 'Organisme Test',
        siret: '12345678901234'
      })
    )
  })

  it('shows validation error and blocks submission when siret is missing', async () => {
    const { finish, mount } = mountCreationForm()
    const wrapper = await mount

    await fillInput(wrapper, 'name', 'Organisme Test')
    await submitForm(wrapper)

    expect(finish).not.toHaveBeenCalled()

    const siretError = wrapper
      .find('input[name="siret"]')
      .element.closest('.fr-input-group')!
      .querySelector('.fr-message--error')

    expect(siretError).not.toBeNull()
    expect(siretError!.textContent).toMatch(/veuillez renseigner ce champ/i)
  })

  it('selects a Data Inclusion structure and submits with DataInclusionV1 source', async () => {
    fakeTrpcClient.dataInclusion.searchStructures.query.mockResolvedValue({
      results: [fakeStructure]
    })

    const { finish, mount } = mountCreationForm()
    const wrapper = await mount

    const nameInput = wrapper.find('input[name="name"]')
    await nameInput.trigger('focus')
    await fillInput(wrapper, 'name', 'Structure')
    await waitForDebounce()

    const option = wrapper.find('li[role="option"]')
    await option.trigger('click')
    await flushPromises()

    const siretInput = wrapper.find<HTMLInputElement>('input[name="siret"]')
    expect(siretInput.element.disabled).toBe(true)

    await submitForm(wrapper)

    expect(finish).toHaveBeenCalledOnce()
    expect(finish).toHaveBeenCalledWith(
      expect.objectContaining({
        dataSource: 'DataInclusionV1',
        dataInclusionIdV1: 'di-structure-1',
        name: 'Structure Data Inclusion',
        siret: '98765432109876'
      })
    )
  })

  it('deselecting Data Inclusion reverts to Custom mode', async () => {
    fakeTrpcClient.dataInclusion.searchStructures.query.mockResolvedValue({
      results: [fakeStructure]
    })

    const { mount } = mountCreationForm()
    const wrapper = await mount

    const nameInput = wrapper.find('input[name="name"]')
    await nameInput.trigger('focus')
    await fillInput(wrapper, 'name', 'Structure')
    await waitForDebounce()

    const option = wrapper.find('li[role="option"]')
    await option.trigger('click')
    await flushPromises()

    expect(
      wrapper.find<HTMLInputElement>('input[name="siret"]').element.disabled
    ).toBe(true)

    fakeTrpcClient.dataInclusion.searchStructures.query.mockResolvedValue({
      results: []
    })
    await fillInput(wrapper, 'name', 'Autre recherche')
    await waitForDebounce()

    const siretInput = wrapper.find<HTMLInputElement>('input[name="siret"]')
    expect(siretInput.element.disabled).toBe(false)
    expect(siretInput.element.value).toBe('')
  })

  it('shows duplicate SIRET warning and hides submit button', async () => {
    fakeTrpcClient.partner.findBySiret.query.mockResolvedValue({
      id: 'existing-id',
      name: 'Organisme Existant',
      siret: '12345678901234',
      inactive: false
    })

    const { finish, mount } = mountCreationForm()
    const wrapper = await mount

    await fillInput(wrapper, 'name', 'Organisme Test')
    await fillInput(wrapper, 'siret', '12345678901234')
    await flushPromises()

    const alert = wrapper.find('.fr-alert--error')
    expect(alert.exists()).toBe(true)
    expect(alert.text()).toMatch(
      /existe déjà avec ce numéro de SIRET.*Organisme Existant/i
    )

    const submitButton = wrapper
      .findAll('button')
      .find(b => b.attributes('title') === 'Valider')
    expect(submitButton).toBeUndefined()

    expect(finish).not.toHaveBeenCalled()
  })

  it('adds contacts and includes them in submission', async () => {
    const { finish, mount } = mountCreationForm()
    const wrapper = await mount

    const addContactButton = wrapper
      .findAll('button')
      .find(b => b.text().includes('Ajouter une personne'))!
    await addContactButton.trigger('click')
    await flushPromises()
    await addContactButton.trigger('click')
    await flushPromises()

    await fillInput(wrapper, 'contacts[0].name', 'Contact 1')
    await fillInput(wrapper, 'contacts[0].phone', '0100000001')
    await fillInput(wrapper, 'contacts[1].name', 'Contact 2')
    await fillInput(wrapper, 'contacts[1].phone', '0100000002')

    const deleteButtons = wrapper
      .findAll('button')
      .filter(b => b.text().includes('Supprimer'))
    await deleteButtons[0]!.trigger('click')
    await flushPromises()

    await fillInput(wrapper, 'name', 'Organisme Test')
    await fillInput(wrapper, 'siret', '12345678901234')
    await submitForm(wrapper)

    expect(finish).toHaveBeenCalledOnce()
    const submittedData = finish.mock.calls[0]![0]
    expect(submittedData.contacts).toHaveLength(1)
    expect(submittedData.contacts[0]).toEqual(
      expect.objectContaining({
        name: 'Contact 2',
        phone: '01 00 00 00 02'
      })
    )
  })
})
