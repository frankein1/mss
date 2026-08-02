import { describe, test, expect } from 'vitest'
import { routes } from './file'
import {
  FilterFileInstructionNotFilled,
  FilterFollowupNotFilled
} from '../constants/filters'
import { TypeSuivi } from '~/client/options'

describe('file routes', () => {
  describe('AppFile', () => {
    test('path returns /app/files/:id', () => {
      expect(routes.AppFile.path('file-1')).toBe('/app/files/file-1')
    })

    test('path returns empty string when familyFileId is undefined', () => {
      expect(routes.AppFile.path(undefined)).toBe('')
    })

    test('path returns path with beneficiaryId option', () => {
      expect(routes.AppFile.path('file-1', { beneficiaryId: 'ben-1' })).toBe(
        '/app/files/file-1?beneficiaryId=ben-1'
      )
    })
  })

  describe('AppFileAdd', () => {
    test('path returns /app/files/add', () => {
      expect(routes.AppFileAdd.path()).toBe('/app/files/add')
    })
  })

  describe('AppHistory', () => {
    test('path returns /app/history', () => {
      expect(routes.AppHistory.path()).toBe('/app/history')
    })
  })

  describe('AppHistoryFollowups', () => {
    test('path returns /app/history/followups without options', () => {
      expect(routes.AppHistoryFollowups.path()).toBe('/app/history/followups')
    })

    test('path returns /app/history/followups with notFilled filter', () => {
      expect(
        routes.AppHistoryFollowups.path({
          notFilled: FilterFollowupNotFilled.Duration
        })
      ).toBe('/app/history/followups?not-filled=duration')
    })
  })

  describe('AppHistoryFileInstructions', () => {
    test('path returns /app/history/file-instructions without options', () => {
      expect(routes.AppHistoryFileInstructions.path()).toBe(
        '/app/history/file-instructions'
      )
    })

    test('path returns /app/history/file-instructions with notFilled filter', () => {
      expect(
        routes.AppHistoryFileInstructions.path({
          notFilled: FilterFileInstructionNotFilled.HousingIsFirst
        })
      ).toBe('/app/history/file-instructions?not-filled=isFirst')
    })
  })

  describe('AppHistoryPrint', () => {
    test('path returns /app/historyprint/:id/print without type', () => {
      expect(routes.AppHistoryPrint.path('h-1')).toBe(
        '/app/historyprint/h-1/print'
      )
    })

    test('path returns /app/historyprint/:id/print with type', () => {
      expect(routes.AppHistoryPrint.path('h-1', TypeSuivi.Followup)).toBe(
        '/app/historyprint/h-1/print?type=Followup'
      )
    })
  })
})
