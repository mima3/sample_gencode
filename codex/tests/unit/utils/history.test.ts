import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { HistoryEntry } from '../../../src/types/mental'
import {
  HISTORY_LIMIT_PER_TYPE,
  HISTORY_STORAGE_KEY,
  appendHistory,
  clearHistoryByType,
  loadHistory,
  saveHistory,
} from '../../../src/utils/history'

function createEntry(index: number, testType: 'burnout' | 'boreout'): HistoryEntry {
  return {
    id: `${testType}-id-${index}`,
    createdAt: `2026-01-01T00:00:${String(index % 60).padStart(2, '0')}.000Z`,
    testType,
    answers: { 0: index % 5 },
    results: [
      {
        key: 'sample',
        title: 'sample',
        score: index,
        rank: 'Ok',
        label: '良好',
        guide: 'guide',
      },
    ],
  }
}

describe('history storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.unstubAllGlobals()
  })

  it('loads empty array when storage is empty or invalid', () => {
    expect(loadHistory()).toEqual([])

    window.localStorage.setItem(HISTORY_STORAGE_KEY, 'not-json')
    expect(loadHistory()).toEqual([])
  })

  it('handles non-array and invalid entries', () => {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify({ foo: 'bar' }))
    expect(loadHistory()).toEqual([])

    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([null, { id: 1 }]))
    expect(loadHistory()).toEqual([])
  })

  it('keeps latest 100 items per test type', () => {
    let latest: HistoryEntry[] = []

    for (let i = 0; i <= HISTORY_LIMIT_PER_TYPE + 20; i += 1) {
      latest = appendHistory(createEntry(i, 'burnout'))
      latest = appendHistory(createEntry(i, 'boreout'))
    }

    const burnout = latest.filter((item) => item.testType === 'burnout')
    const boreout = latest.filter((item) => item.testType === 'boreout')

    expect(burnout).toHaveLength(HISTORY_LIMIT_PER_TYPE)
    expect(boreout).toHaveLength(HISTORY_LIMIT_PER_TYPE)
    expect(burnout[0]?.id).toBe(`burnout-id-${HISTORY_LIMIT_PER_TYPE + 20}`)
    expect(boreout[0]?.id).toBe(`boreout-id-${HISTORY_LIMIT_PER_TYPE + 20}`)
  })

  it('deletes history only for target test type', () => {
    appendHistory(createEntry(1, 'burnout'))
    appendHistory(createEntry(1, 'boreout'))

    const afterClearBurnout = clearHistoryByType('burnout')
    expect(afterClearBurnout.some((item) => item.testType === 'burnout')).toBe(false)
    expect(afterClearBurnout.some((item) => item.testType === 'boreout')).toBe(true)
  })

  it('returns safely when window is undefined', () => {
    vi.stubGlobal('window', undefined)

    expect(loadHistory()).toEqual([])
    expect(() => saveHistory([createEntry(1, 'burnout')])).not.toThrow()
  })
})
