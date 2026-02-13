import { describe, expect, it } from 'vitest'
import {
  BOREOUT_OPTIONS,
  BURNOUT_OPTIONS,
  boreoutQuestions,
  burnoutResultDefinitions,
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

  it('covers all evaluator branches for emotionalExhaustion', () => {
    const evaluator = burnoutResultDefinitions.find(
      (definition) => definition.key === 'emotionalExhaustion',
    )!.evaluator

    expect(evaluator(15)).toBe('Ok')
    expect(evaluator(16)).toBe('Normal')
    expect(evaluator(19)).toBe('Caution')
    expect(evaluator(21)).toBe('Warning')
    expect(evaluator(24)).toBe('Danger')
  })

  it('covers all evaluator branches for depersonalization', () => {
    const evaluator = burnoutResultDefinitions.find(
      (definition) => definition.key === 'depersonalization',
    )!.evaluator

    expect(evaluator(11)).toBe('Ok')
    expect(evaluator(12)).toBe('Normal')
    expect(evaluator(15)).toBe('Caution')
    expect(evaluator(18)).toBe('Warning')
    expect(evaluator(21)).toBe('Danger')
  })

  it('covers all evaluator branches for personalAccomplishment', () => {
    const evaluator = burnoutResultDefinitions.find(
      (definition) => definition.key === 'personalAccomplishment',
    )!.evaluator

    expect(evaluator(9)).toBe('Danger')
    expect(evaluator(10)).toBe('Warning')
    expect(evaluator(13)).toBe('Caution')
    expect(evaluator(16)).toBe('Warning')
    expect(evaluator(18)).toBe('Ok')
  })
})
