import { RESULT_LABELS, burnoutResultDefinitions } from '../data/mentalTests'

export function calculateBurnoutResults(answers, questions) {
  const categoryTotals = questions.reduce(
    (acc, question, index) => {
      acc[question.category] += Number(answers[index])
      return acc
    },
    {
      emotionalExhaustion: 0,
      depersonalization: 0,
      personalAccomplishment: 0,
    },
  )

  return burnoutResultDefinitions.map((definition) => {
    const score = categoryTotals[definition.key]
    const rank = definition.evaluator(score)

    return {
      key: definition.key,
      title: definition.title,
      score,
      rank,
      label: RESULT_LABELS[rank],
      guide: definition.guide,
    }
  })
}

export function calculateBoreoutResult(answers) {
  const score = Object.values(answers).reduce((sum, value) => sum + Number(value), 0)
  const rank = score < 4 ? 'Ok' : 'Warning'

  return {
    key: 'boreout',
    title: 'ボーアウト判定',
    score,
    rank,
    label: rank === 'Ok' ? '良好' : '注意',
    guide:
      rank === 'Ok'
        ? '現時点では大きなボーアウト傾向は見られません。'
        : '退屈・無意味感が蓄積している可能性があります。業務内容の見直しや裁量の調整を検討してください。',
  }
}
