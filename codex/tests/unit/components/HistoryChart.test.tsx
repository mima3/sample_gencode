import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HistoryChart from '../../../src/components/HistoryChart'
import type { HistoryEntry, TestResult } from '../../../src/types/mental'

function createResult(key: string, score: number): TestResult {
  return {
    key,
    title: key,
    score,
    rank: 'Ok',
    label: '良好',
    guide: 'guide',
  }
}

function createEntry(id: string, testType: 'burnout' | 'boreout', results: TestResult[]): HistoryEntry {
  return {
    id,
    createdAt: new Date().toISOString(),
    testType,
    answers: { 0: 1 },
    results,
  }
}

describe('HistoryChart', () => {
  it('renders 3 burnout series with category labels', () => {
    const entries = [
      createEntry('a', 'burnout', [
        createResult('emotionalExhaustion', 2),
        createResult('depersonalization', 3),
        createResult('personalAccomplishment', 4),
      ]),
      createEntry('b', 'burnout', [
        createResult('emotionalExhaustion', 1),
        createResult('depersonalization', 2),
        createResult('personalAccomplishment', 3),
      ]),
    ]

    const { container } = render(<HistoryChart entries={entries} testType="burnout" />)

    expect(screen.getByLabelText('スコア履歴グラフ')).toBeInTheDocument()
    expect(screen.getByText('情緒的消耗感')).toBeInTheDocument()
    expect(screen.getByText('脱人格化')).toBeInTheDocument()
    expect(screen.getByText('個人的達成感')).toBeInTheDocument()
    expect(container.querySelectorAll('.history-line-path')).toHaveLength(3)
  })

  it('renders single boreout series', () => {
    const entries = [createEntry('b1', 'boreout', [createResult('boreout', 4)])]
    const { container } = render(<HistoryChart entries={entries} testType="boreout" />)
    expect(screen.getByText('ボーアウト判定')).toBeInTheDocument()
    expect(container.querySelectorAll('.history-line-path')).toHaveLength(1)
  })

  it('uses score 0 when boreout result array is empty', () => {
    const entries = [createEntry('b2', 'boreout', [])]
    const { container } = render(<HistoryChart entries={entries} testType="boreout" />)
    const latestScoreLabel = container.querySelector('.history-line-value.series-boreout')
    expect(latestScoreLabel).not.toBeNull()
    expect(latestScoreLabel?.textContent).toBe('0')
  })

  it('returns null when there are no entries', () => {
    const { container } = render(<HistoryChart entries={[]} testType="boreout" />)
    expect(container.firstChild).toBeNull()
  })
})
