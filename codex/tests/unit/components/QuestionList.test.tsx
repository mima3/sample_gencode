import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import QuestionList from '../../../src/components/QuestionList'
import type { Answers, Option, QuestionInput } from '../../../src/types/mental'

describe('QuestionList', () => {
  it('renders question rows and updates answers through state updater', () => {
    const questions: QuestionInput[] = [
      { text: '質問A', category: 'emotionalExhaustion' },
      '質問B',
    ]
    const options: Option[] = [
      { value: 0, label: 'いいえ' },
      { value: 1, label: 'はい' },
    ]
    const answers: Answers = { 0: 0, 1: 0 }
    const onChange = vi.fn()

    render(<QuestionList answers={answers} options={options} questions={questions} onChange={onChange} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('質問A')).toBeInTheDocument()
    expect(screen.getByText('質問B')).toBeInTheDocument()

    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[1], { target: { value: '1' } })

    expect(onChange).toHaveBeenCalledTimes(1)

    const updater = onChange.mock.calls[0][0] as (prev: Answers) => Answers
    const next = updater({ 0: 0, 1: 0 })
    expect(next[0]).toBe(0)
    expect(next[1]).toBe(1)
  })
})
