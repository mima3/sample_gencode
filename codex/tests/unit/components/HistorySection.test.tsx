import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import HistorySection from '../../../src/components/HistorySection'
import type { HistoryEntry, TestResult } from '../../../src/types/mental'

function createResult(score: number): TestResult {
  return {
    key: 'result',
    title: 'テスト結果',
    score,
    rank: 'Ok',
    label: '良好',
    guide: 'guide',
  }
}

function createEntry(): HistoryEntry {
  return {
    id: 'entry-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    testType: 'boreout',
    answers: { 0: 1, 1: 0 },
    results: [createResult(3)],
  }
}

describe('HistorySection', () => {
  it('shows empty state when there is no history', () => {
    render(<HistorySection entries={[]} onDelete={vi.fn()} title="履歴" testType="burnout" />)
    expect(screen.getByText('まだ履歴はありません。')).toBeInTheDocument()
  })

  it('renders history entries and calls onDelete', () => {
    const onDelete = vi.fn()
    render(<HistorySection entries={[createEntry()]} onDelete={onDelete} title="履歴" testType="boreout" />)

    expect(screen.getByLabelText('スコア履歴グラフ')).toBeInTheDocument()
    expect(screen.getByText('テスト結果: 3（良好）')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '履歴を削除' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
