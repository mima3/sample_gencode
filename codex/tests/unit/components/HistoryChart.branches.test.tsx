import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('HistoryChart branch coverage', () => {
  afterEach(() => {
    vi.resetModules()
    vi.doUnmock('react')
  })

  it('handles a series item with empty points without rendering latest value label', async () => {
    vi.doMock('react', async () => {
      const actual = await vi.importActual<typeof import('react')>('react')

      return {
        ...actual,
        useMemo: vi.fn(() => [
          {
            key: 'series-a',
            label: 'A',
            className: 'series-boreout',
            points: [{ index: 1, score: 2 }],
          },
          {
            key: 'series-b',
            label: 'B',
            className: 'series-boreout',
            points: [],
          },
        ]),
      }
    })

    const { default: HistoryChart } = await import('../../../src/components/HistoryChart')
    const { container } = render(<HistoryChart entries={[]} testType="boreout" />)

    expect(container.querySelectorAll('.history-line-value')).toHaveLength(1)
    expect(container.querySelectorAll('.history-line-path')).toHaveLength(2)
  })

  it('throws when useMemo returns malformed series data', async () => {
    let accessCount = 0
    const stablePoints = [{ index: 1, score: 2 }]
    const firstSeries = {
      key: 'series-a',
      label: 'A',
      className: 'series-boreout',
      get points() {
        accessCount += 1
        if (accessCount === 3 || accessCount === 11) {
          return undefined as unknown as Array<{ index: number; score: number }>
        }
        return stablePoints
      },
    }

    vi.doMock('react', async () => {
      const actual = await vi.importActual<typeof import('react')>('react')
      return {
        ...actual,
        useMemo: vi.fn(() => [
          firstSeries,
          { key: 'series-b', label: 'B', className: 'series-boreout', points: stablePoints },
        ]),
      }
    })

    const { default: HistoryChart } = await import('../../../src/components/HistoryChart')
    expect(() => render(<HistoryChart entries={[]} testType="boreout" />)).toThrow()
  })
})
