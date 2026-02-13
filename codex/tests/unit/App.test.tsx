import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from '../../src/App'
import { HISTORY_STORAGE_KEY } from '../../src/utils/history'
import type { HistoryEntry, TestResult } from '../../src/types/mental'

const originalCrypto = globalThis.crypto
const baseResult: TestResult = {
  key: 'sample',
  title: 'sample',
  score: 1,
  rank: 'Ok',
  label: '良好',
  guide: 'guide',
}

function createHistoryEntry(
  id: string,
  testType: 'burnout' | 'boreout',
  answers: Record<number, number>,
): HistoryEntry {
  return {
    id,
    createdAt: new Date().toISOString(),
    testType,
    answers,
    results: [{ ...baseResult, key: `${testType}-${id}` }],
  }
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    // restore crypto if a test stubs it
    Object.defineProperty(globalThis, 'crypto', {
      value: originalCrypto,
      configurable: true,
    })
  })

  it('shows results only after clicking the calculate button and shows only burnout history on burnout tab', () => {
    const { container } = render(<App />)

    expect(screen.getByRole('heading', { name: 'バーンアウト診断' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '情緒的消耗感' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '判定する' }))

    expect(screen.getByRole('heading', { name: '情緒的消耗感' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'バーンアウト履歴（最新100件）' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'ボーアウト履歴（最新100件）' })).not.toBeInTheDocument()
    expect(container.querySelectorAll('.history-item')).toHaveLength(1)

    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    expect(raw).not.toBeNull()
    expect(raw).toContain('"testType":"burnout"')
  })

  it('stores boreout history and can delete boreout history', () => {
    const { container } = render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'ボーアウト' }))
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: '判定する' }))

    expect(screen.getByRole('heading', { name: 'ボーアウト判定' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'ボーアウト履歴（最新100件）' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'バーンアウト履歴（最新100件）' })).not.toBeInTheDocument()
    expect(container.querySelectorAll('.history-item')).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: '履歴を削除' }))

    expect(container.querySelectorAll('.history-item')).toHaveLength(0)
    expect(screen.getByText('まだ履歴はありません。')).toBeInTheDocument()

    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    expect(raw).not.toBeNull()
    expect(raw).not.toContain('"testType":"boreout"')
  })

  it('can delete burnout history on burnout tab', () => {
    const { container } = render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '判定する' }))
    expect(container.querySelectorAll('.history-item')).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: '履歴を削除' }))
    expect(container.querySelectorAll('.history-item')).toHaveLength(0)

    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    expect(raw).not.toBeNull()
    expect(raw).not.toContain('"testType":"burnout"')
  })

  it('uses fallback id path when crypto.randomUUID is unavailable', () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      configurable: true,
    })

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '判定する' }))

    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    expect(raw).not.toBeNull()

    const parsed = JSON.parse(raw ?? '[]') as Array<{ id: string }>
    expect(parsed[0]?.id).toMatch(/\d+-[0-9a-f]+/)
  })

  it('uses latest history answers as defaults for each test tab', () => {
    const burnoutAnswers = { 0: 5, 1: 4, 2: 3 }
    const boreoutAnswers = { 0: 1, 1: 1, 2: 0 }
    const history: HistoryEntry[] = [
      createHistoryEntry('burnout-latest', 'burnout', burnoutAnswers),
      createHistoryEntry('boreout-latest', 'boreout', boreoutAnswers),
    ]
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))

    render(<App />)
    const burnoutSelects = screen.getAllByRole('combobox')
    expect((burnoutSelects[0] as HTMLSelectElement).value).toBe('5')

    fireEvent.click(screen.getByRole('button', { name: 'ボーアウト' }))
    const boreoutSelects = screen.getAllByRole('combobox')
    expect((boreoutSelects[0] as HTMLSelectElement).value).toBe('1')
  })

  it('shows a score history chart when history exists on the active tab', () => {
    const history: HistoryEntry[] = [createHistoryEntry('burnout-1', 'burnout', { 0: 5 })]
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))

    render(<App />)
    expect(screen.getByLabelText('スコア履歴グラフ')).toBeInTheDocument()
  })

  it('falls back to initial answer when latest history answer is invalid', () => {
    const history: HistoryEntry[] = [
      {
        ...createHistoryEntry('burnout-invalid', 'burnout', { 0: Number.NaN }),
        answers: { 0: Number.NaN } as Record<number, number>,
      },
    ]
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))

    render(<App />)
    const select = screen.getAllByRole('combobox')[0] as HTMLSelectElement
    expect(select.value).toBe('1')
  })
})
