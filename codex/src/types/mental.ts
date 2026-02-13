export type ActiveTest = 'burnout' | 'boreout'

export type RiskLevel = 'Ok' | 'Normal' | 'Caution' | 'Warning' | 'Danger'

export type BurnoutCategory = 'emotionalExhaustion' | 'depersonalization' | 'personalAccomplishment'

export type Answers = Record<number, number>

export type Option = {
  value: number
  label: string
}

export type BurnoutQuestion = {
  text: string
  category: BurnoutCategory
}

export type BoreoutQuestion = string

export type QuestionInput = BoreoutQuestion | BurnoutQuestion

export type BurnoutResultDefinition = {
  key: BurnoutCategory
  title: string
  guide: string
  evaluator: (score: number) => RiskLevel
}

export type TestResult = {
  key: string
  title: string
  score: number
  rank: RiskLevel
  label: string
  guide: string
}
