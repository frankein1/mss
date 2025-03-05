import { describe, it, expect } from 'vitest'
import {
  BeneficiaryWithActivityDates,
  getArchiveDate,
  getBeneficiaryLastActivity,
  getMostRecenttDate
} from './get-last-activity.service'

describe('getMostRecenttDate', () => {
  it('should return 2024-01-14T16:42:37+01:00', () => {
    const dates = [
      new Date('2023-05-12T14:22:21+01:00'),
      new Date('2020-09-27T09:10:45+01:00'),
      new Date('2019-03-08T18:35:12+01:00'),
      new Date('2021-11-15T22:50:30+01:00'),
      new Date('2022-07-10T07:14:55+01:00'),
      new Date('2018-12-03T12:05:09+01:00'),
      new Date('2018-12-03T12:05:09+01:00'),
      new Date('2024-01-14T16:42:37+01:00'),
      new Date('2020-06-22T20:31:44+01:00'),
      new Date('2023-02-19T03:28:59+01:00'),
      new Date('2019-10-30T23:59:00+01:00')
    ]

    const lastDate = getMostRecenttDate(dates)
    expect(lastDate).toEqual(new Date('2024-01-14T16:42:37+01:00'))
  })
})

describe('getArchiveDate', () => {
  it('should return archiveDueDate', () => {
    // il n'y a pas eu d'activité depuis l'action de conservation du dossier
    const lastActivity = new Date('2020-06-22T20:31:44+01:00')
    const archiveDueDate = new Date('2025-10-30T23:59:00+01:00')
    const archiveDate = getArchiveDate(lastActivity, archiveDueDate)
    expect(archiveDate).toEqual(archiveDueDate)
  })
  it('should return lastActivity + 2 years', () => {
    // il y a eu une activité depuis l'action de conservation du dossier
    const lastActivity = new Date('2024-06-22T20:31:44+01:00')
    const archiveDueDate = new Date('2024-10-30T23:59:00+01:00')
    const archiveDate = getArchiveDate(lastActivity, archiveDueDate)
    expect(archiveDate).toEqual(new Date('2026-06-22T20:31:44+01:00'))
  })
  it('should return lastActivity + 2 years', () => {
    // il n'y a pas eu de conservation du dossier
    const lastActivity = new Date('2020-06-22T20:31:44+01:00')
    const archiveDate = getArchiveDate(lastActivity, null)
    expect(archiveDate).toEqual(new Date('2022-06-22T20:31:44+01:00'))
  })
})

describe('getBeneficiaryLastActivity', () => {
  it('sould return 2024-11-11T03:28:59+01:00', () => {
    const beneficiaryLastactivity = getBeneficiaryLastActivity(
      beneficiaryWithActivity
    )
    expect(beneficiaryLastactivity).toEqual(
      new Date('2024-11-11T03:28:59+01:00')
    )
  })
})

const beneficiaryWithActivity: BeneficiaryWithActivityDates = {
  updated: new Date('2020-09-27T09:10:45+01:00'),
  created: new Date('2020-09-27T09:10:45+01:00'),
  familyFile: {
    budget: {
      updated: new Date('2024-01-14T16:42:37+01:00'),
      expenses: {
        updated: new Date('2023-02-19T03:28:59+01:00'),
        customs: [{ updated: new Date('2023-02-19T03:28:59+01:00') }],
        loans: [{ updated: new Date('2023-02-19T03:28:59+01:00') }],
        debts: [{ updated: new Date('2023-02-19T03:28:59+01:00') }]
      },
      incomes: [
        {
          updated: new Date('2019-10-30T23:59:00+01:00'),
          customs: [
            {
              updated: new Date('2021-11-15T22:50:30+01:00')
            }
          ]
        },
        {
          updated: new Date('2022-07-10T07:14:55+01:00'),
          customs: [
            {
              updated: new Date('2021-11-15T22:50:30+01:00')
            }
          ]
        }
      ]
    }
  },
  socialSupports: [
    {
      updated: new Date('2021-11-15T22:50:30+01:00')
    }
  ],
  documents: [
    {
      created: new Date('2024-11-11T03:28:59+01:00')
    }
  ]
}
