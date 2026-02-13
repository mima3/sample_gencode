import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ResultGrid from '../../../src/components/ResultGrid'
import type { TestResult } from '../../../src/types/mental'

describe('ResultGrid', () => {
  it('renders result cards with score and rank classes', () => {
    const results: TestResult[] = [
      {
        key: 'r1',
        title: '情緒的消耗感',
        score: 20,
        rank: 'Caution',
        label: '注意',
        guide: 'ガイド1',
      },
      {
        key: 'r2',
        title: 'ボーアウト判定',
        score: 4,
        rank: 'Warning',
        label: '要注意',
        guide: 'ガイド2',
      },
    ]

    render(<ResultGrid results={results} />)

    expect(screen.getByRole('heading', { name: '情緒的消耗感' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'ボーアウト判定' })).toBeInTheDocument()
    expect(screen.getByText('score: 20')).toBeInTheDocument()
    expect(screen.getByText('score: 4')).toBeInTheDocument()

    expect(screen.getByText('注意')).toHaveClass('is-caution')
    expect(screen.getByText('要注意')).toHaveClass('is-warning')
  })
})
