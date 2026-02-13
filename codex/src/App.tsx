import { useState } from 'react'
import './App.css'
import Hero from './components/Hero'
import QuestionList from './components/QuestionList'
import ResultGrid from './components/ResultGrid'
import TestSwitcher from './components/TestSwitcher'
import {
  BOREOUT_OPTIONS,
  BURNOUT_OPTIONS,
  boreoutQuestions,
  burnoutQuestions,
  createBoreoutInitialAnswers,
  createBurnoutInitialAnswers,
} from './data/mentalTests'
import { calculateBoreoutResult, calculateBurnoutResults } from './utils/scoring'
import type { ActiveTest, TestResult } from './types/mental'

function App() {
  const [activeTest, setActiveTest] = useState<ActiveTest>('burnout')
  const [burnoutAnswers, setBurnoutAnswers] = useState(createBurnoutInitialAnswers)
  const [boreoutAnswers, setBoreoutAnswers] = useState(createBoreoutInitialAnswers)
  const [burnoutResults, setBurnoutResults] = useState<TestResult[] | null>(null)
  const [boreoutResult, setBoreoutResult] = useState<TestResult | null>(null)

  const handleBurnoutCalculate = () => {
    setBurnoutResults(calculateBurnoutResults(burnoutAnswers, burnoutQuestions))
  }

  const handleBoreoutCalculate = () => {
    setBoreoutResult(calculateBoreoutResult(boreoutAnswers))
  }

  return (
    <main className="app-shell">
      <Hero />
      <TestSwitcher activeTest={activeTest} onChange={setActiveTest} />

      {activeTest === 'burnout' ? (
        <section className="panel">
          <header className="panel-header">
            <h2>バーンアウト診断</h2>
            <p>各設問について、頻度に最も近いものを選択してください。</p>
          </header>

          <QuestionList
            answers={burnoutAnswers}
            options={BURNOUT_OPTIONS}
            questions={burnoutQuestions}
            onChange={setBurnoutAnswers}
          />
          <div className="action-row">
            <button className="calculate-button" type="button" onClick={handleBurnoutCalculate}>
              判定する
            </button>
          </div>
          {burnoutResults && <ResultGrid results={burnoutResults} />}
        </section>
      ) : (
        <section className="panel">
          <header className="panel-header">
            <h2>ボーアウト診断</h2>
            <p>各設問に「はい / いいえ」で答えてください。</p>
          </header>

          <QuestionList
            answers={boreoutAnswers}
            options={BOREOUT_OPTIONS}
            questions={boreoutQuestions}
            onChange={setBoreoutAnswers}
          />
          <div className="action-row">
            <button className="calculate-button" type="button" onClick={handleBoreoutCalculate}>
              判定する
            </button>
          </div>
          {boreoutResult && <ResultGrid results={[boreoutResult]} />}
        </section>
      )}
    </main>
  )
}

export default App
