import type { Dispatch, SetStateAction } from 'react'
import type { Answers, Option, QuestionInput } from '../types/mental'

type QuestionListProps = {
  answers: Answers
  options: Option[]
  questions: QuestionInput[]
  onChange: Dispatch<SetStateAction<Answers>>
}

function QuestionList({ answers, options, questions, onChange }: QuestionListProps) {
  return (
    <div className="question-grid" role="list">
      {questions.map((question, index) => {
        const text = typeof question === 'string' ? question : question.text

        return (
          <label className="question-row" key={`question-${index}`} role="listitem">
            <span className="question-index">Q{index + 1}</span>
            <span className="question-text">{text}</span>
            <select
              value={answers[index]}
              onChange={(event) => {
                const value = Number(event.target.value)
                onChange((prev) => ({ ...prev, [index]: value }))
              }}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )
      })}
    </div>
  )
}

export default QuestionList
