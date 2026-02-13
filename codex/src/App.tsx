import { useMemo, useState } from 'react'
import './App.css'
import Hero from './components/Hero'
import HistorySection from './components/HistorySection'
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
import { appendHistory, clearHistoryByType, loadHistory } from './utils/history'
import { calculateBoreoutResult, calculateBurnoutResults } from './utils/scoring'
import type { ActiveTest, Answers, HistoryEntry, TestResult } from './types/mental'

function createHistoryId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function getLatestAnswers(
  history: HistoryEntry[],
  testType: ActiveTest,
  fallback: Answers,
  questionCount: number,
): Answers {
  const latest = history.find((entry) => entry.testType === testType)
  if (!latest) {
    return fallback
  }

  const next: Answers = {}
  for (let i = 0; i < questionCount; i += 1) {
    const value = latest.answers[i]
    const fallbackValue = fallback[i]
    next[i] =
      typeof value === 'number' && Number.isFinite(value)
        ? value
        : typeof fallbackValue === 'number' && Number.isFinite(fallbackValue)
          ? fallbackValue
          : 0
  }
  return next
}

function App() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())
  const [activeTest, setActiveTest] = useState<ActiveTest>('burnout')
  const [burnoutAnswers, setBurnoutAnswers] = useState<Answers>(() =>
    getLatestAnswers(history, 'burnout', createBurnoutInitialAnswers(), burnoutQuestions.length),
  )
  const [boreoutAnswers, setBoreoutAnswers] = useState<Answers>(() =>
    getLatestAnswers(history, 'boreout', createBoreoutInitialAnswers(), boreoutQuestions.length),
  )
  const [burnoutResults, setBurnoutResults] = useState<TestResult[] | null>(null)
  const [boreoutResult, setBoreoutResult] = useState<TestResult | null>(null)

  const burnoutHistory = useMemo(
    () => history.filter((entry) => entry.testType === 'burnout'),
    [history],
  )
  const boreoutHistory = useMemo(
    () => history.filter((entry) => entry.testType === 'boreout'),
    [history],
  )

  const handleBurnoutCalculate = () => {
    const results = calculateBurnoutResults(burnoutAnswers, burnoutQuestions)
    setBurnoutResults(results)
    setHistory(
      appendHistory({
        id: createHistoryId(),
        createdAt: new Date().toISOString(),
        testType: 'burnout',
        answers: burnoutAnswers,
        results,
      }),
    )
  }

  const handleBoreoutCalculate = () => {
    const result = calculateBoreoutResult(boreoutAnswers)
    setBoreoutResult(result)
    setHistory(
      appendHistory({
        id: createHistoryId(),
        createdAt: new Date().toISOString(),
        testType: 'boreout',
        answers: boreoutAnswers,
        results: [result],
      }),
    )
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

      <section className="panel history-panel">
        <header className="panel-header">
          <h2>履歴</h2>
          <p>「判定する」を押した結果を保存しています。テスト種別ごとに最新100件まで保持します。</p>
        </header>

        {activeTest === 'burnout' ? (
          <HistorySection
            entries={burnoutHistory}
            onDelete={() => setHistory(clearHistoryByType('burnout'))}
            title="バーンアウト履歴（最新100件）"
            testType="burnout"
          />
        ) : (
          <HistorySection
            entries={boreoutHistory}
            onDelete={() => setHistory(clearHistoryByType('boreout'))}
            title="ボーアウト履歴（最新100件）"
            testType="boreout"
          />
        )}
      </section>
    </main>
  )
}

export default App
