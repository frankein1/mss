// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import PartnerOrganizationEdition from './PartnerOrganizationEdition.vue'
import {
  createFakeTrpcClient,
  createFakePartner,
  fillInput,
  submitForm,
  waitForDebounce
} from '~~/test/components/helpers'

const fakeTrpcClient = createFakeTrpcClient()

mockNuxtImport('useTrpcClient', () => () => fakeTrpcClient)

const fakeStructureA = {
  id: 'di-structure-a',
  name: 'Structure DI Alpha',
  siret: null,
  address: '10 avenue des Champs',
  zipcode: '75008',
  city: 'Paris',
  email: 'alpha@di.fr',
  phone: '0100000010',
  website: 'https://alpha.fr',
  workingHours: 'Lundi-Vendredi 9h-17h'
}

const fakeStructureB = {
  id: 'di-structure-b',
  name: 'Structure DI Beta',
  siret: '99988877766655',
  address: '5 rue du Soleil',
  zipcode: '69001',
  city: 'Lyon',
  email: 'beta@di.fr',
  phone: '0400000001',
  website: 'https://beta.fr',
  workingHours: 'Lundi-Samedi 8h-18h'
}

function mountEditionForm(partnerOverrides?: Record<string, unknown>) {
  const partner = createFakePartner(partnerOverrides)
  fakeTrpcClient.partner.getOne.query.mockResolvedValue(partner)

  const finish = vi.fn()
  const restore = vi.fn()
  return {
    finish,
    restore,
    partner,
    mount: mountSuspended(PartnerOrganizationEdition, {
      props: {
        id: partner.id as string,
        isSubmitting: false,
        existingDataInclusionV1Ids: [],
        finish,
        cancel: vi.fn(),
        restore
      }
    })
  }
}

describe('PartnerOrganizationEdition', () => {
  beforeEach(() => {
    fakeTrpcClient.partner.findBySiret.query.mockResolvedValue(null)
    fakeTrpcClient.dataInclusion.searchStructures.query.mockResolvedValue({
      results: []
    })
  })

  it('edits a Custom partner: pre-fills fields, modifies and submits', async () => {
    const { finish, mount } = mountEditionForm({ phone2: '0200000002' })
    const wrapper = await mount

    const nameInput = wrapper.find<HTMLInputElement>('input[name="name"]')
    expect(nameInput.element.value).toBe('Organisme Test')

    const siretInput = wrapper.find<HTMLInputElement>('input[name="siret"]')
    expect(siretInput.element.value).toBe('12345678901234')
    expect(siretInput.element.disabled).toBe(false)

    const addressInput = wrapper.find<HTMLInputElement>('input[name="address"]')
    expect(addressInput.element.value).toBe('1 rue de la Paix')

    const phone2Input = wrapper.find<HTMLInputElement>('input[name="phone2"]')
    expect(phone2Input.exists()).toBe(true)

    await fillInput(wrapper, 'name', 'Organisme Modifié')
    await submitForm(wrapper)

    expect(finish).toHaveBeenCalledOnce()
    expect(finish).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '00000000-0000-0000-0000-000000000001',
        dataSource: 'Custom',
        name: 'Organisme Modifié',
        siret: '12345678901234'
      })
    )
  })

  it('switches a DI partner to another DI partner and submits', async () => {
    const { finish, mount } = mountEditionForm({
      dataSource: 'DataInclusionV1',
      dataInclusionIdV1: 'di-structure-a',
      siret: null,
      dataInclusionStructureV1: fakeStructureA
    })
    const wrapper = await mount

    expect(
      wrapper.find<HTMLInputElement>('input[name="siret"]').element.disabled
    ).toBe(true)

    fakeTrpcClient.dataInclusion.searchStructures.query.mockResolvedValue({
      results: [fakeStructureB]
    })

    const nameInput = wrapper.find('input[name="name"]')
    await nameInput.trigger('focus')
    await fillInput(wrapper, 'name', 'Beta')
    await waitForDebounce()

    const option = wrapper.find('li[role="option"]')
    await option.trigger('click')
    await flushPromises()

    await submitForm(wrapper)

    expect(finish).toHaveBeenCalledOnce()
    expect(finish).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '00000000-0000-0000-0000-000000000001',
        dataSource: 'DataInclusionV1',
        dataInclusionIdV1: 'di-structure-b',
        name: 'Structure DI Beta',
        siret: '99988877766655'
      })
    )
  })

  it('treats LegacyDataInclusionV0 as Custom with editable fields', async () => {
    const { mount } = mountEditionForm({
      dataSource: 'LegacyDataInclusionV0'
    })
    const wrapper = await mount

    expect(
      wrapper.find<HTMLInputElement>('input[name="siret"]').element.disabled
    ).toBe(false)
    expect(
      wrapper.find<HTMLInputElement>('input[name="address"]').element.disabled
    ).toBe(false)
    expect(
      wrapper.find<HTMLInputElement>('input[name="email"]').element.disabled
    ).toBe(false)
  })

  it('duplicate SIRET: skips self, blocks other partner', async () => {
    fakeTrpcClient.partner.findBySiret.query.mockResolvedValue({
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Organisme Test',
      siret: '12345678901234',
      inactive: false
    })

    const { mount } = mountEditionForm()
    const wrapper = await mount

    await fillInput(wrapper, 'siret', '12345678901234')
    await flushPromises()

    expect(wrapper.find('.fr-alert--error').exists()).toBe(false)
    const submitButton = wrapper
      .findAll('button')
      .find(b => b.attributes('title') === 'Valider')
    expect(submitButton).toBeDefined()

    fakeTrpcClient.partner.findBySiret.query.mockResolvedValue({
      id: 'other-partner',
      name: 'Autre Organisme',
      siret: '99999999999999',
      inactive: false
    })

    await fillInput(wrapper, 'siret', '99999999999999')
    await flushPromises()

    const alert = wrapper.find('.fr-alert--error')
    expect(alert.exists()).toBe(true)
    expect(alert.text()).toMatch(
      /existe déjà avec ce numéro de SIRET.*Autre Organisme/i
    )
    const hiddenSubmit = wrapper
      .findAll('button')
      .find(b => b.attributes('title') === 'Valider')
    expect(hiddenSubmit).toBeUndefined()
  })

  it('switches from DI back to Custom: fields cleared and editable', async () => {
    const { mount } = mountEditionForm({
      dataSource: 'DataInclusionV1',
      dataInclusionIdV1: 'di-structure-a',
      siret: null,
      dataInclusionStructureV1: fakeStructureA
    })
    const wrapper = await mount

    expect(
      wrapper.find<HTMLInputElement>('input[name="siret"]').element.disabled
    ).toBe(true)

    fakeTrpcClient.dataInclusion.searchStructures.query.mockResolvedValue({
      results: []
    })
    await fillInput(wrapper, 'name', 'Recherche sans résultat')
    await waitForDebounce()

    const siretInput = wrapper.find<HTMLInputElement>('input[name="siret"]')
    expect(siretInput.element.disabled).toBe(false)
    expect(siretInput.element.value).toBe('')

    const emailInput = wrapper.find<HTMLInputElement>('input[name="email"]')
    expect(emailInput.element.disabled).toBe(false)
    expect(emailInput.element.value).toBe('')
  })

  it('pre-populates existing contacts and allows adding one more', async () => {
    const { finish, mount } = mountEditionForm({
      contacts: [
        {
          id: 'c1',
          name: 'Alice Dupont',
          phone: '0100000001',
          email: 'alice@test.fr'
        },
        { id: 'c2', name: 'Bob Martin', phone: '0100000002', email: null }
      ]
    })
    const wrapper = await mount

    const contact0Name = wrapper.find<HTMLInputElement>(
      'input[name="contacts[0].name"]'
    )
    expect(contact0Name.element.value).toBe('Alice Dupont')

    const contact1Name = wrapper.find<HTMLInputElement>(
      'input[name="contacts[1].name"]'
    )
    expect(contact1Name.element.value).toBe('Bob Martin')

    const addContactButton = wrapper
      .findAll('button')
      .find(b => b.text().includes('Ajouter une personne'))!
    await addContactButton.trigger('click')
    await flushPromises()

    await fillInput(wrapper, 'contacts[2].name', 'Charlie Nouveau')
    await fillInput(wrapper, 'contacts[2].phone', '0300000003')

    await submitForm(wrapper)

    expect(finish).toHaveBeenCalledOnce()
    const submittedData = finish.mock.calls[0]![0]
    expect(submittedData.contacts).toHaveLength(3)
    expect(submittedData.contacts[2]).toEqual(
      expect.objectContaining({
        name: 'Charlie Nouveau',
        phone: '03 00 00 00 03'
      })
    )
  })
})
