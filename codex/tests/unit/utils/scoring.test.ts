import { describe, expect, it } from 'vitest'
import { burnoutQuestions } from '../../../src/data/mentalTests'
import type { Answers } from '../../../src/types/mental'
import { calculateBoreoutResult, calculateBurnoutResults } from '../../../src/utils/scoring'

function createAnswers(values: number[]): Answers {
  return values.reduce<Answers>((acc, value, index) => {
    acc[index] = value
    return acc
  }, {})
}

describe('calculateBoreoutResult', () => {
  it('returns Ok when score is under 4', () => {
    const answers = createAnswers([1, 1, 1, 0, 0, 0, 0, 0, 0, 0])

    const result = calculateBoreoutResult(answers)

    expect(result.score).toBe(3)
    expect(result.rank).toBe('Ok')
    expect(result.label).toBe('良好')
  })

  it('returns Warning when score is 4 or more', () => {
    const answers = createAnswers([1, 1, 1, 1, 0, 0, 0, 0, 0, 0])

    const result = calculateBoreoutResult(answers)

    expect(result.score).toBe(4)
    expect(result.rank).toBe('Warning')
    expect(result.label).toBe('注意')
  })
})

describe('calculateBurnoutResults', () => {
  it('aggregates category scores and returns expected ranks', () => {
    const answers = createAnswers(new Array(burnoutQuestions.length).fill(1))

    const results = calculateBurnoutResults(answers, burnoutQuestions)

    const emotional = results.find((result) => result.key === 'emotionalExhaustion')
    const depersonalization = results.find((result) => result.key === 'depersonalization')
    const accomplishment = results.find((result) => result.key === 'personalAccomplishment')

    expect(emotional?.score).toBe(5)
    expect(emotional?.rank).toBe('Ok')

    expect(depersonalization?.score).toBe(6)
    expect(depersonalization?.rank).toBe('Ok')

    expect(accomplishment?.score).toBe(6)
    expect(accomplishment?.rank).toBe('Danger')
  })

  it('returns high risk for high emotional/depersonalization scores', () => {
    const allMaxAnswers = createAnswers(new Array(burnoutQuestions.length).fill(5))

    const results = calculateBurnoutResults(allMaxAnswers, burnoutQuestions)
    const emotional = results.find((result) => result.key === 'emotionalExhaustion')
    const depersonalization = results.find((result) => result.key === 'depersonalization')

    expect(emotional?.score).toBe(25)
    expect(emotional?.rank).toBe('Danger')

    expect(depersonalization?.score).toBe(30)
    expect(depersonalization?.rank).toBe('Danger')
  })
})
