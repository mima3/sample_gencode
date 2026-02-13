import { describe, expect, it } from 'vitest'
import {
  BOREOUT_OPTIONS,
  BURNOUT_OPTIONS,
  boreoutQuestions,
  burnoutQuestions,
  createBoreoutInitialAnswers,
  createBurnoutInitialAnswers,
} from '../../../src/data/mentalTests'

describe('mentalTests data', () => {
  it('creates burnout initial answers with minimum option value', () => {
    const answers = createBurnoutInitialAnswers()

    expect(Object.keys(answers)).toHaveLength(burnoutQuestions.length)
    expect(Object.values(answers).every((value) => value === BURNOUT_OPTIONS[0]!.value)).toBe(true)
  })

  it('creates boreout initial answers with minimum option value', () => {
    const answers = createBoreoutInitialAnswers()

    expect(Object.keys(answers)).toHaveLength(boreoutQuestions.length)
    expect(Object.values(answers).every((value) => value === BOREOUT_OPTIONS[0]!.value)).toBe(true)
  })
})
